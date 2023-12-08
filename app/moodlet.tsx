import {
  Button,
  Icon,
  Layout,
  Text,
  useStyleSheet,
} from "@ui-kitten/components"
import * as Notifications from "expo-notifications"
import { Link, router } from "expo-router"
import { Timestamp, addDoc, collection } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import emotions from "./assets/emotions.json"
import { BottomTabNavigation } from "./components/BottomTabNavigation"
import JumpIcon from "./components/JumpIcon"
import { database } from "./config/firebase"
import { showToastError, showToastSuccess } from "./helpers/toasts"
import { getUser, saveMood } from "./helpers/userHelper"
import LayoutStyle from "./styles/Layout"
import TextStyle from "./styles/Text"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

// This page will get the users current mood
export default function Page() {
  const layout = useStyleSheet(LayoutStyle)
  const selectedMood = useRef<string>("")

  const [expoPushToken, setExpoPushToken] = useState<string>("")
  const [notification, setNotification] = useState<any>()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const notificationListener = useRef<any>()
  const responseListener = useRef<any>()

  /**
   * Updates the user's mood in Firebase and navigates to the status page.
   * @param mood The user's selected mood.
   */
  const handleGoToStatus = async (mood: string) => {
    selectedMood.current = mood
    await getUser().then(async user => {
      if (user) {
        setIsLoggedIn(true)

        // Upload the new mood to Firebase
        const moodRef = collection(database, "mood")
        const moodData = {
          dateCreated: Timestamp.now(),
          mood,
          userID: user,
        }

        try {
          await addDoc(moodRef, moodData).then(() => {
            saveMood(mood)
            showToastSuccess("Mood saved!")
            router.replace("/status")
          })
        } catch (error: any) {
          showToastError("Error updating mood data: " + error.message)
        }
      } else {
        setIsLoggedIn(false)
        showToastError("Please sign up to update your Moodlets.")
      }
    })
  }

  /**
   * Sets up and clears the notification listeners
   */
  useEffect(() => {
    const handleNotLoggedInUser = async () => {
      await getUser().then(user => {
        if (!user) {
          setIsLoggedIn(false)
        } else {
          setIsLoggedIn(true)
        }
      })
    }

    // Handle not logged in
    handleNotLoggedInUser()
  }, [])

  return (
    <>
      <Layout style={layout.basic}>
        <Text style={[TextStyle.pageTitle]} category="h1">
          How are you?
        </Text>
        <Layout style={layout.rowEvenly}>
          {emotions.map((emotion: { text: string; color: string }) => (
            <JumpIcon
              key={emotion.text}
              text={emotion.text}
              color={emotion.color}
              handlePress={() => handleGoToStatus(emotion.text)}
            />
          ))}
        </Layout>
        {!isLoggedIn && (
          <Layout style={[layout.rowEvenly, { marginTop: 10 }]}>
            <Link href="/signup" asChild>
              <Button
                status="danger"
                size={"giant"}
                accessoryLeft={<Icon name="log-in-outline" />}>
                Sign up
              </Button>
            </Link>
          </Layout>
        )}
      </Layout>

      <BottomTabNavigation currentSelected={0} />
    </>
  )
}
