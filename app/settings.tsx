import {
  Button,
  Icon,
  Layout,
  Text,
  Toggle,
  useStyleSheet,
} from "@ui-kitten/components"
import * as Notifications from "expo-notifications"
import { Link, router } from "expo-router"
import { deleteUser, getAuth, signOut } from "firebase/auth"
import {
  collection,
  deleteDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import originalStatus from "./assets/status.json"
import ResetPassword from "./components/ResetPassword"
import { database } from "./config/firebase"
import {
  scheduleStatusNotification,
  setDailyNotificationReminder,
} from "./helpers/notifications"
import { fetchStatusData } from "./helpers/statusHelpers"
import { showToastError } from "./helpers/toasts"
import {
  getUser,
  removeAllNotificationsFromDevice,
  removeMood,
  removeNotificationFromDevice,
  removeStatus,
  removeUser,
  removeUserCode,
  saveNotificationOnDevice,
} from "./helpers/userHelper"
import LayoutStyle from "./styles/Layout"
import TextStyle from "./styles/Text"
import { IStatus, ReminderState } from "./types/types"

const Page: React.FC = () => {
  const layout = useStyleSheet(LayoutStyle)

  const [status, setStatus] = useState<IStatus>(originalStatus)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [userId, setUserId] = useState<string>("")

  const [isResetOpen, setIsResetOpen] = useState<boolean>(false)
  const [allReminders, setAllReminders] = useState<ReminderState>({
    daily: false,
    hunger: false,
    thirst: false,
    energy: false,
    hygiene: false,
    social: false,
    fun: false,
  })

  const toggleReminder = (key: keyof ReminderState, isChecked: boolean) => {
    setAllReminders(prevState => ({ ...prevState, [key]: isChecked }))
  }

  const reminderLabels: { [K in keyof ReminderState]: string } = {
    daily: "9am Daily Update Reminder",
    hunger: "Hunger Reminder",
    thirst: "Thirst Reminder",
    energy: "Energy Reminder",
    hygiene: "Hygiene Reminder",
    social: "Social Reminder",
    fun: "Fun Reminder",
  }

  /**
   * Load the user's current notifications.
   */
  useEffect(() => {
    getCurrentNotifications()
    const user = getUser()
    user.then(user => {
      setUserId(user || "No id")
    })
  }, [])

  /**
   * Get the user's current notifications.
   */
  const getCurrentNotifications = async () => {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync()

    if (notifications.length > 0) {
      notifications.forEach(async notification => {
        const notificationBody = notification.content.body

        if (notification.content.title === "❤️ Moodlets Reminder! ❤️") {
          setAllReminders(prevState => ({ ...prevState, daily: true }))
        }

        if (notificationBody?.includes("hunger")) {
          setAllReminders(prevState => ({ ...prevState, hunger: true }))
        }

        if (notificationBody?.includes("thirst")) {
          setAllReminders(prevState => ({ ...prevState, thirst: true }))
        }

        if (notificationBody?.includes("energy")) {
          setAllReminders(prevState => ({ ...prevState, energy: true }))
        }

        if (notificationBody?.includes("hygiene")) {
          setAllReminders(prevState => ({ ...prevState, hygiene: true }))
        }

        if (notificationBody?.includes("social")) {
          setAllReminders(prevState => ({ ...prevState, social: true }))
        }

        if (notificationBody?.includes("fun")) {
          setAllReminders(prevState => ({ ...prevState, fun: true }))
        }
      })
    }
  }

  /**
   * Set notifications when the user toggles them on/off.
   * @param notificationToUpdate
   * @param turnOff
   */
  const updateNotifications = async (
    notificationToUpdate: string,
    turnOff: boolean,
  ) => {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync()

    // If no notifications at all
    if (notifications.length === 0 && !turnOff) {
      if (notificationToUpdate === "daily") {
        // Set new notification
        setDailyNotificationReminder()
      }

      return
    }

    // To turn on a notification
    if (!turnOff) {
      turnOnNotification(notificationToUpdate)
    }

    // To turn off existing notifications
    notifications.forEach(async notification => {
      turnOffNotification(notification, notificationToUpdate)
    })
  }

  /**
   * Set each individual notification
   * @param notificationToUpdate
   */
  const turnOnNotification = async (notificationToUpdate: string) => {
    // Fetch status to calculate new notification time
    fetchStatusData(setStatus, setIsLoaded)

    switch (notificationToUpdate) {
      case "hunger":
        // Calculate and set new notification
        await scheduleStatusNotification(notificationToUpdate, status.hunger)
        // Store new notification on device
        saveNotificationOnDevice(notificationToUpdate)
        break

      case "thirst":
        await scheduleStatusNotification(notificationToUpdate, status.thirst)
        saveNotificationOnDevice(notificationToUpdate)
        break

      case "energy":
        await scheduleStatusNotification(notificationToUpdate, status.energy)
        saveNotificationOnDevice(notificationToUpdate)
        break

      case "hygiene":
        await scheduleStatusNotification(notificationToUpdate, status.hygiene)
        saveNotificationOnDevice(notificationToUpdate)
        break

      case "social":
        await scheduleStatusNotification(notificationToUpdate, status.social)
        saveNotificationOnDevice(notificationToUpdate)
        break

      case "fun":
        await scheduleStatusNotification(notificationToUpdate, status.fun)
        saveNotificationOnDevice(notificationToUpdate)
        break

      default:
        break
    }
  }

  const turnOffNotification = async (
    notification: any,
    notificationToUpdate: string,
  ) => {
    const notificationBody = notification.content.body

    switch (notificationToUpdate) {
      case "daily":
        // Confirm daily notification
        if (notification.content.title === "❤️ Moodlets Reminder! ❤️") {
          // Delete notification
          removeNotificationFromDevice("daily")
          Notifications.cancelScheduledNotificationAsync(
            notification.identifier,
          )
        }
        break

      case "hunger":
        if (notificationBody?.includes(notificationToUpdate)) {
          removeNotificationFromDevice(notificationToUpdate)
          Notifications.cancelScheduledNotificationAsync(
            notification.identifier,
          )
        }
        break

      case "thirst":
        if (notificationBody?.includes(notificationToUpdate)) {
          removeNotificationFromDevice(notificationToUpdate)
          Notifications.cancelScheduledNotificationAsync(
            notification.identifier,
          )
        }
        break

      case "energy":
        if (notificationBody?.includes(notificationToUpdate)) {
          removeNotificationFromDevice(notificationToUpdate)
          Notifications.cancelScheduledNotificationAsync(
            notification.identifier,
          )
        }
        break

      case "hygiene":
        if (notificationBody?.includes(notificationToUpdate)) {
          removeNotificationFromDevice(notificationToUpdate)
          Notifications.cancelScheduledNotificationAsync(
            notification.identifier,
          )
        }
        break

      case "social":
        if (notificationBody?.includes(notificationToUpdate)) {
          removeNotificationFromDevice(notificationToUpdate)
          Notifications.cancelScheduledNotificationAsync(
            notification.identifier,
          )
        }
        break

      case "fun":
        if (notificationBody?.includes(notificationToUpdate)) {
          removeNotificationFromDevice(notificationToUpdate)
          Notifications.cancelScheduledNotificationAsync(
            notification.identifier,
          )
        }
        break

      default:
        break
    }
  }

  /**
   * Turn off all notifications.
   */
  const turnOffAllNotifications = async () => {
    Notifications.cancelAllScheduledNotificationsAsync()
    setAllReminders({
      daily: false,
      hunger: false,
      thirst: false,
      energy: false,
      hygiene: false,
      social: false,
      fun: false,
    })

    removeAllNotificationsFromDevice()
  }

  /**
   * Deletes the user's account and all associated data.
   */
  const handleDelete = async () => {
    const auth = getAuth()
    const user = getUser()

    // Delete all this user statuses
    const statusQuery = query(
      collection(database, "status"),
      where("userID", "==", user),
      orderBy("dateCreated", "desc"),
      limit(100),
    )

    const statusQuerySnapshot = await getDocs(statusQuery)
    statusQuerySnapshot.forEach(doc => {
      deleteDoc(doc.ref)
    })

    // Delete all this user moods
    const moodQuery = query(
      collection(database, "mood"),
      where("userID", "==", user),
      orderBy("dateCreated", "desc"),
      limit(100),
    )

    const moodQuerySnapshot = await getDocs(moodQuery)
    moodQuerySnapshot.forEach(doc => {
      deleteDoc(doc.ref)
    })

    // Delete user
    const userQuery = query(
      collection(database, "user"),
      where("userID", "==", user),
      orderBy("dateCreated", "desc"),
    )

    const userQuerySnapshot = await getDocs(userQuery)
    userQuerySnapshot.forEach(doc => {
      deleteDoc(doc.ref)
    })

    // Delete from Firebase auth
    deleteUser(auth.currentUser!)

    // Remove local stored user
    removeUser()

    // Remove all local notifications
    removeAllNotificationsFromDevice()

    // Clear all notifications
    Notifications.cancelAllScheduledNotificationsAsync()

    // Redirect
    router.replace("/signup")
  }

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    // Clear all scheduled notifications first
    Notifications.cancelAllScheduledNotificationsAsync()

    // Remove storage
    removeUser()

    // Remove all local states
    removeUserCode()
    removeStatus()
    removeMood()

    // Sign out of Firebase
    const auth = getAuth()
    await signOut(auth)
      .then(() => {
        router.replace("/signup")
      })
      .catch((error: any) => {
        showToastError(error)
      })
  }

  return (
    <ScrollView style={{ backgroundColor: "#94CBFF" }}>
      <Layout style={layout.basic}>
        <Text style={[TextStyle.pageTitle]} category="h1">
          Settings
        </Text>
        <Text
          category="h3"
          style={[TextStyle.title, TextStyle.bold, { marginBottom: 20 }]}>
          Notifications
        </Text>
        <Layout
          style={[
            layout.colLeft,
            { paddingHorizontal: 10, marginVertical: 10 },
          ]}>
          {Object.keys(allReminders).map(key => (
            <Toggle
              key={key}
              checked={allReminders[key as keyof ReminderState]}
              onChange={isChecked => {
                updateNotifications(key as keyof ReminderState, !isChecked)
                toggleReminder(key as keyof ReminderState, isChecked)
              }}
              style={[TextStyle.text, { marginBottom: 10 }]}
              status="basic">
              {reminderLabels[key as keyof ReminderState]}
            </Toggle>
          ))}
          <Button
            onPress={turnOffAllNotifications}
            style={{ marginTop: 10 }}
            accessoryLeft={<Icon name="close" />}>
            Remove All Notifications
          </Button>
        </Layout>
        <Text
          category="h3"
          style={[TextStyle.title, TextStyle.bold, { marginBottom: 20 }]}>
          Account
        </Text>
        <Layout
          style={[
            layout.colLeft,
            { paddingHorizontal: 10, marginVertical: 10 },
          ]}>
          {isResetOpen ? (
            <ResetPassword
              handleClose={() => {
                setIsResetOpen(false)
              }}
            />
          ) : (
            <Button
              onPress={() => {
                setIsResetOpen(true)
              }}
              accessoryLeft={<Icon name="refresh-outline" />}
              status="warning">
              Reset Password
            </Button>
          )}

          <Button
            onPress={handleDelete}
            status="danger"
            style={{ marginVertical: 10 }}
            accessoryLeft={<Icon name="trash-2-outline" />}>
            Delete Account
          </Button>
        </Layout>

        <Layout style={[layout.rowEvenly, { marginTop: 50 }]}>
          <Link href="/profile" asChild>
            <Button
              status="info"
              size={"small"}
              accessoryLeft={<Icon name="arrow-back-outline" />}>
              Return to Moodlets
            </Button>
          </Link>
          <Button
            status="danger"
            size={"small"}
            onPress={handleLogout}
            accessoryLeft={<Icon name="log-out-outline" />}>
            Log Out
          </Button>
        </Layout>

        <Text style={[TextStyle.text, { marginTop: 25, opacity: 0.5 }]}>
          Version: 1.1.20
        </Text>
        <Text style={[TextStyle.text, { opacity: 0.5 }]}>{userId}</Text>
      </Layout>
    </ScrollView>
  )
}

export default Page
