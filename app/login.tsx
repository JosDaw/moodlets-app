import {
  Button,
  Icon,
  Input,
  Layout,
  Text,
  useStyleSheet,
} from "@ui-kitten/components"
import { Link, router } from "expo-router"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { ScrollView } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import Loading from "./components/Loading"
import PasswordIcon from "./components/PasswordIcon"
import ResetPassword from "./components/ResetPassword"
import { firebaseErrorCodes } from "./helpers/errors"
import { setDailyNotificationReminder } from "./helpers/notifications"
import { showToastError } from "./helpers/toasts"
import { checkNotificationAlreadyExists, saveUser } from "./helpers/userHelper"
import LayoutStyle from "./styles/Layout"
import TextStyle from "./styles/Text"
import { ILogin } from "./types/types"

// Login
export default function Page() {
  const layout = useStyleSheet(LayoutStyle)

  const [loginInfo, setLoginInfo] = useState<ILogin>({
    email: "",
    password: "",
  })

  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isResetOpen, setIsResetOpen] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  /**
   * Handles the login process
   */
  const handleLogin = async () => {
    if (!loginInfo.email || !loginInfo.password)
      return showToastError("Please enter your email and password.")

    setIsSaving(true)

    const auth = getAuth()

    // Register with Firebase auth
    await signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
      .then(async (userCredential: { user: { uid: string } }) => {
        const hasDaily = checkNotificationAlreadyExists("daily")
        if (!hasDaily) {
          // Sets up the daily notification reminder.
          setDailyNotificationReminder()
        }

        // Save user id
        saveUser(userCredential.user.uid)

        // Navigate to moodlet page
        router.push("/moodlet")
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
              value={loginInfo.email}
              onChangeText={value => {
                setLoginInfo({ ...loginInfo, email: value })
              }}
              style={{ margin: 10 }}
              disabled={isSaving}
              autoCapitalize='none'
            />

            <Input
              label="Password"
              placeholder="Password"
              value={loginInfo.password}
              onChangeText={value => {
                setLoginInfo({ ...loginInfo, password: value })
              }}
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

            <Button
              style={{ marginTop: 100 }}
              status="danger"
              size={"giant"}
              accessoryLeft={<Icon name="log-in-outline" />}
              onPress={handleLogin}
              disabled={isSaving}>
              Login
            </Button>
            {isSaving && <Loading />}

            <Layout style={[layout.rowEvenly, { marginTop: 40 }]}>
              <Link href="/signup" asChild>
                <Button
                  style={{ marginTop: 50 }}
                  status="success"
                  size={"medium"}
                  accessoryLeft={<Icon name="person-add-outline" />}>
                  Sign Up
                </Button>
              </Link>
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
            </Layout>
          </Layout>
        </Layout>
      </ScrollView>
    </KeyboardAwareScrollView>
  )
}
