import { A } from "@expo/html-elements"
import {
  Button,
  Icon,
  Input,
  Layout,
  Text,
  useStyleSheet,
} from "@ui-kitten/components"
import * as Notifications from "expo-notifications"
import { Link, router } from "expo-router"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { Timestamp, addDoc, collection } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import Loading from "./components/Loading"
import PasswordIcon from "./components/PasswordIcon"
import { database } from "./config/firebase"
import { firebaseErrorCodes } from "./helpers/errors"
import {
  registerForPushNotificationsAsync,
  setDailyNotificationReminder,
} from "./helpers/notifications"
import { showToastError } from "./helpers/toasts"
import {
  allowAllNotificationsOnDevice,
  removeAllNotificationsFromDevice,
  saveUser,
} from "./helpers/userHelper"
import LayoutStyle from "./styles/Layout"
import TextStyle from "./styles/Text"
import { ISignup } from "./types/types"

// Introduce and sign up the users
const Signup = () => {
  const layout = useStyleSheet(LayoutStyle)

  const [signupInfo, setSignupInfo] = useState<ISignup>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })
  const [expoPushToken, setExpoPushToken] = useState<string>("")
  const responseListener = useRef<any>()
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  /**
   * Sets up and clears the notification listeners
   */
  useEffect(() => {
    // Clear all scheduled notifications first
    Notifications.cancelAllScheduledNotificationsAsync()

    // Get token to set new tokens
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token as string)
    })

    responseListener.current = null

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

  /**
   * Handle sign up
   * @returns
   */
  const handleSignup = async () => {
    setIsSaving(true)

    if (
      signupInfo.email === "" ||
      signupInfo.password === "" ||
      signupInfo.confirmPassword === "" ||
      signupInfo.name === ""
    ) {
      showToastError("Please fill in all the fields to register.")
      setIsSaving(false)
      return
    }

    // Basic validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{6,}$/

    if (!passwordRegex.test(signupInfo.password)) {
      showToastError(
        "Password must be at least 6 characters long, contain at least 1 uppercase letter and 1 number.",
      )
      setIsSaving(false)
      return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!emailRegex.test(signupInfo.email)) {
      showToastError("Please enter a valid email.")
      setIsSaving(false)
      return
    }

    if (signupInfo.password !== signupInfo.confirmPassword) {
      showToastError("Passwords do not match.")
      setIsSaving(false)
      return
    }

    const auth = getAuth()

    // Register with Firebase auth
    await createUserWithEmailAndPassword(
      auth,
      signupInfo.email,
      signupInfo.password,
    )
      .then(async (userCredential: { user: { uid: string } }) => {
        // Save user to Firebase
        try {
          await addDoc(collection(database, "user"), {
            name: signupInfo.name,
            email: signupInfo.email,
            userID: userCredential.user.uid,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            dateCreated: Timestamp.now(),
            expoPushToken: expoPushToken || "",
          }).then(() => {
            // Remove all local notifications
            removeAllNotificationsFromDevice()

            // Set daily notification reminder
            setDailyNotificationReminder()

            // Set all notifications as allowed for initial signup
            allowAllNotificationsOnDevice()

            // Save userID to device
            saveUser(userCredential.user.uid)

            // Navigate to moodlet page
            router.push("/moodlet")
          })
        } catch (error: any) {
          showToastError(error.message)
          setIsSaving(false)
        }
      })
      .catch((error: any) => {
        setIsSaving(false)
        const errorCode = error.code
        showToastError(firebaseErrorCodes(errorCode))
      })
  }

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: "#94CBFF" }}>
      <ScrollView>
        <Layout style={layout.basic}>
          <Text style={[TextStyle.pageTitle]} category="h1">
            Welcome to Moodlets
          </Text>
          <Layout style={[layout.colCenter]}>
            <Input
              label="Email"
              placeholder="Email"
              value={signupInfo.email}
              onChangeText={value => {
                setSignupInfo({ ...signupInfo, email: value })
              }}
              style={{ margin: 10 }}
              disabled={isSaving}
              autoCapitalize='none'
            />
            <Input
              label="Name"
              placeholder="Name"
              value={signupInfo.name}
              onChangeText={value => {
                setSignupInfo({ ...signupInfo, name: value })
              }}
              style={{ margin: 10 }}
              disabled={isSaving}
            />
            <Input
              label="Password"
              placeholder="Password"
              value={signupInfo.password}
              onChangeText={value => {
                setSignupInfo({ ...signupInfo, password: value })
              }}
              maxLength={50}
              secureTextEntry={!showPassword}
              style={{ margin: 10 }}
              disabled={isSaving}
              autoCapitalize='none'
              autoCorrect={false}
              accessoryRight={props => (
                <PasswordIcon
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  props={props}
                />
              )}
            />
            <Input
              label="Confirm Password"
              placeholder="Confirm Password"
              value={signupInfo.confirmPassword}
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={value => {
                setSignupInfo({ ...signupInfo, confirmPassword: value })
              }}
              secureTextEntry={!showPassword}
              style={{ margin: 10 }}
              disabled={isSaving}
              maxLength={50}
              accessoryRight={props => (
                <PasswordIcon
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  props={props}
                />
              )}
            />
            <Text
              category="p2"
              appearance="hint"
              status="danger"
              style={[TextStyle.text]}>
              Password must be at least 6 characters long, contain at least 1
              uppercase letter and 1 number.
            </Text>

            <Layout
              style={{ marginVertical: 10, backgroundColor: "transparent" }}>
              <Text category="h5" style={[TextStyle.subtitle]}>
                By clicking Save below, you agree to the Moodlets{" "}
                <A
                  href="https://mymoodlets.com/privacy"
                  style={[TextStyle.bold, { textDecorationLine: "underline" }]}>
                  Privacy Policy
                </A>{" "}
                and{" "}
                <A
                  href="https://mymoodlets.com/terms"
                  style={[TextStyle.bold, { textDecorationLine: "underline" }]}>
                  Terms and Conditions
                </A>
                .
              </Text>
            </Layout>

            <Layout style={layout.rowEvenly}>
              <Button
                style={{ marginTop: 20 }}
                status="danger"
                size={"giant"}
                accessoryLeft={<Icon name="save-outline" />}
                onPress={handleSignup}
                disabled={isSaving}>
                Save
              </Button>
              <Link asChild href="/profile">
                <Button
                  style={{ marginTop: 20 }}
                  status="info"
                  size={"medium"}
                  accessoryLeft={<Icon name="arrow-forward-outline" />}
                  disabled={isSaving}>
                  Register Later
                </Button>
              </Link>
            </Layout>

            {isSaving && <Loading />}

            <Link href="/login" asChild>
              <Button
                style={{ marginTop: 50 }}
                status="warning"
                size={"medium"}
                accessoryLeft={<Icon name="log-in-outline" />}>
                Log In
              </Button>
            </Link>
          </Layout>
        </Layout>
      </ScrollView>
    </KeyboardAwareScrollView>
  )
}

export default Signup
