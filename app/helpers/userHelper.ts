import { IFirebaseStatus } from "@/types/types"
import * as Notifications from "expo-notifications"
import * as SecureStore from "expo-secure-store"

/**
 * Store user info to device
 * @param {string} value
 */
async function saveUser(value: string) {
  await SecureStore.setItemAsync("user", value)
}

/**
 * Get user info from device
 * @returns
 */
async function getUser() {
  const user = await SecureStore.getItemAsync("user")
  return user
}

/**
 * Remove user info from device
 */
async function removeUser() {
  await SecureStore.deleteItemAsync("user")
}

/**
 * Saves a notification to the device
 * @param notification
 * @returns
 */
async function saveNotificationOnDevice(notification: string) {
  const existingNotifications = await getAllNotificationsOnDevice()

  // If existingNotifications is not an array or null, create an empty array
  let notificationsArray = Array.isArray(existingNotifications)
    ? existingNotifications
    : []

  if (existingNotifications.includes(notification)) {
    return
  }

  if (existingNotifications === null) {
    await SecureStore.setItemAsync(
      "notifications",
      JSON.stringify([notification]),
    )
  } else {
    await SecureStore.setItemAsync(
      "notifications",
      JSON.stringify(notificationsArray.concat(notification)),
    )
  }
}

/**
 * Removes notification from device
 * @param notification
 * @returns
 */
async function removeNotificationFromDevice(notification: string) {
  const existingNotifications = await getAllNotificationsOnDevice()

  // If existingNotifications is not an array or null, create an empty array
  let notificationsArray = Array.isArray(existingNotifications)
    ? existingNotifications
    : []

  if (existingNotifications === null) {
    return
  } else {
    const filteredNotifications = notificationsArray.filter(
      (existingNotification: string) => existingNotification !== notification,
    )

    await SecureStore.setItemAsync(
      "notifications",
      JSON.stringify(filteredNotifications),
    )
  }
}

/**
 * Get all notifications on device
 * @returns
 */
async function getAllNotificationsOnDevice() {
  const notifications = await SecureStore.getItemAsync("notifications")

  if (notifications === null) {
    return []
  }

  return JSON.parse(notifications)
}

/**
 * Removes all notifications from device
 */
async function removeAllNotificationsFromDevice() {
  await SecureStore.deleteItemAsync("notifications")
}

/**
 * Check if notification already exists on device
 * @param notification
 * @returns
 */
async function checkNotificationAlreadyExists(
  notification: string,
): Promise<boolean> {
  try {
    const existingNotifications = await getAllNotificationsOnDevice()

    // Check if existingNotifications is an array and if it includes the notification
    return (
      Array.isArray(existingNotifications) &&
      existingNotifications.includes(notification)
    )
  } catch (error) {
    return false
  }
}

/**
 * Checks if a notification with the same time already exists on the device.
 * @param hour Hour to check.
 * @param minute Minute to check.
 * @returns True if a matching notification exists, false otherwise.
 */
async function checkSameTimeNotificationAlreadyExists(
  hour: number,
  minute: number,
): Promise<boolean> {
  try {
    const existingNotifications =
      await Notifications.getAllScheduledNotificationsAsync()

    return existingNotifications.some(notification => {
      const trigger = notification.trigger as any
      return (
        trigger.dateComponents.hour === hour &&
        trigger.dateComponents.minute === minute
      )
    })
  } catch (error) {
    // Handle or log the error as needed
    return false
  }
}

async function allowAllNotificationsOnDevice() {
  await SecureStore.setItemAsync(
    "notifications",
    JSON.stringify([
      "daily",
      "hunger",
      "thirst",
      "energy",
      "hygiene",
      "social",
      "fun",
    ]),
  )
}

async function saveMood(mood: string) {
  await SecureStore.setItemAsync("mood", mood)
}

async function getMood() {
  const mood = await SecureStore.getItemAsync("mood")
  return mood
}

async function saveStatus(status: IFirebaseStatus) {
  await SecureStore.setItemAsync("status", JSON.stringify(status))
}

async function getStatus() {
  const status = await SecureStore.getItemAsync("status")
  return status ? JSON.parse(status) : null
}

async function saveUserCode(userCode: string) {
  await SecureStore.setItemAsync("userCode", userCode)
}

async function getUserCode() {
  const userCode = await SecureStore.getItemAsync("userCode")
  return userCode
}

async function removeUserCode() {
  await SecureStore.deleteItemAsync("userCode")
}

async function removeMood() {
  await SecureStore.deleteItemAsync("mood")
}

async function removeStatus() {
  await SecureStore.deleteItemAsync("status")
}

export {
  allowAllNotificationsOnDevice,
  checkNotificationAlreadyExists,
  checkSameTimeNotificationAlreadyExists,
  getAllNotificationsOnDevice,
  getMood,
  getStatus,
  getUser,
  getUserCode,
  removeAllNotificationsFromDevice,
  removeMood,
  removeNotificationFromDevice,
  removeStatus,
  removeUser,
  removeUserCode,
  saveMood,
  saveNotificationOnDevice,
  saveStatus,
  saveUser,
  saveUserCode,
}
