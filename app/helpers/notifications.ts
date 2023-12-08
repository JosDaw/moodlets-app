import { IStatus } from "@/types/types"
import Constants from "expo-constants"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import {
  computeNotificationTime,
  getSecondsUntilNextTime,
} from "./dateTimeHelpers"
import { showToastError } from "./toasts"
import {
  checkSameTimeNotificationAlreadyExists,
  saveNotificationOnDevice,
} from "./userHelper"

/**
 * Schedules a push notification with the given title, body, hour, and minute.
 * @param title - The title of the notification.
 * @param body - The body of the notification.
 * @param hour - The hour at which to schedule the notification.
 * @param minute - The minute at which to schedule the notification.
 */
async function schedulePushNotification(
  title: string,
  body: string,
  hour: number,
  minute: number,
) {
  if (Device.osName === "Android") {
    const secondsUntilNotification = getSecondsUntilNextTime(hour, minute)
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: { seconds: secondsUntilNotification, repeats: false },
    })
  } else {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: { hour, minute, repeats: false },
    })
  }
}

async function registerForPushNotificationsAsync() {
  let token

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== "granted") {
      showToastError("Failed to get push token for push notification!")
      return
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants?.expoConfig?.extra?.eas.projectId,
      })
    ).data
  } else {
    showToastError("Must use physical device for Push Notifications")
  }

  return token
}

/**
 * Set daily notification reminder
 * Store daily notification reminder to device
 */
async function setDailyNotificationReminder() {
  // Make sure there is not already one scheduled
  const existingNotifications =
    await Notifications.getAllScheduledNotificationsAsync()

  const stringifyExisting = JSON.stringify(existingNotifications)

  // Exit early if already exists
  if (stringifyExisting.includes("How are you feeling today?")) {
    return
  }

  saveNotificationOnDevice("daily")
  if (Device.osName === "Android") {
    const secondsUntil9AM = getSecondsUntilNextTime(9)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "❤️ Moodlets Reminder! ❤️",
        body: "How are you feeling today?",
      },
      trigger: { seconds: secondsUntil9AM, repeats: true },
    })
  } else {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "❤️ Moodlets Reminder! ❤️",
        body: "How are you feeling today?",
      },
      trigger: { hour: 9, minute: 0, repeats: true },
    })
  }
}

/**
 * Calculate and schedule a status notification
 * @param key
 * @param element
 */
async function scheduleStatusNotification(key: string, element: number) {
  // TODO: check if a notification is already scheduled at that time
  // If so, add an extra 30 mins to the notification time

  const notificationTime = computeNotificationTime(
    key as keyof IStatus,
    element,
  )

  // Check if that time already exists
  const isExistingTime = await checkSameTimeNotificationAlreadyExists(
    notificationTime.hour,
    notificationTime.minute,
  )

  let hourToSet = notificationTime.hour
  let minuteToSet = notificationTime.minute

  // If the time already exists, add 30 mins or 1 hour to the time
  if (isExistingTime) {
    minuteToSet = minuteToSet + 30
    if (minuteToSet >= 60) {
      minuteToSet = 0
      hourToSet = hourToSet + 1
    }
  }

  // Set notification based on message
  const notificationMessage = getNotificationMessage(element, key)

  await schedulePushNotification(
    "❤️ Moodlets Update! ❤️",
    notificationMessage,
    notificationTime.hour,
    notificationTime.minute,
  )

  // Save locally
  saveNotificationOnDevice(key)
}

/**
 * Clear all scheduled notifications except the daily notification reminder
 */
async function clearAllScheduledNotificationsExceptDaily() {
  const notifications = await Notifications.getAllScheduledNotificationsAsync()
  if (notifications.length > 0) {
    notifications.forEach(async notification => {
      if (notification.content.title !== "❤️ Moodlets Reminder! ❤️") {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier,
        )
      }
    })
  }
}

const getNotificationMessage = (element: number, keyName: string): string => {
  const highLevelMessages = [
    `Your ${keyName} level are good. A little top-up wouldn't hurt though!`,
    `Doing well with your ${keyName}! Consider a small boost for optimal balance.`,
    `Great job on your ${keyName} level! A slight increase could be even better.`,
    `Your ${keyName} is on point! Keep it steady, maybe add a bit more. 🌱`,
    `Nice work maintaining your ${keyName}. A tiny bit more can be beneficial.`,
    `Solid ${keyName} level! Keep it up and maybe add a touch more. ☀️`,
    `You're managing your ${keyName} well. A small addition could be perfect.`,
    `Good control over your ${keyName} level. How about a slight increase?`,
    `Your ${keyName} level are looking good. A small boost could do wonders. ✨`,
    `Well-balanced ${keyName} level! A minor top-up might be a good idea.`,
  ]

  const lowLevelMessages = [
    `Your ${keyName} level are a bit low. Time for a small boost!`,
    `A friendly reminder: top up your ${keyName} level when you can.`,
    `Looks like your ${keyName} could use a bit of attention.`,
    `Time to focus a little on your ${keyName} level. You've got this!`,
    `Consider giving your ${keyName} level a nudge. It helps!`,
    `A small boost to your ${keyName} level would be good now.`,
    `It's a good time to review your ${keyName} level. Keep an eye on it!`,
    `How about we raise those ${keyName} level a bit?`,
    `Boosting your ${keyName} a little could be beneficial. 🚀`,
    `An increase in your ${keyName} level is recommended. 🌟`,
  ]

  const randomIndex = Math.floor(Math.random() * highLevelMessages.length)
  return element > 0.5
    ? highLevelMessages[randomIndex]
    : lowLevelMessages[randomIndex]
}

export {
  clearAllScheduledNotificationsExceptDaily,
  registerForPushNotificationsAsync,
  schedulePushNotification,
  scheduleStatusNotification,
  setDailyNotificationReminder,
}
