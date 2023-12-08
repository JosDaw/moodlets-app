import { Button, Input, Layout, Text } from "@ui-kitten/components"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { useState } from "react"
import { firebaseErrorCodes } from "../helpers/errors"
import { showToastError, showToastSuccess } from "../helpers/toasts"
import LayoutStyle from "../styles/Layout"
import TextStyle from "../styles/Text"
import Loading from "./Loading"

interface ResetPasswordProps {
  handleClose: () => void
}

const ResetPassword = ({ handleClose }: ResetPasswordProps) => {
  const [email, setEmail] = useState<string>("")
  const [isSaving, setIsSaving] = useState<boolean>(false)

  /**
   * Sends a password reset email via Firebase
   */
  const handlePasswordReset = () => {
    if (email !== "") {
      setIsSaving(true)
      const auth = getAuth()

      sendPasswordResetEmail(auth, email)
        .then(() => {
          showToastSuccess("Password reset email sent!")
          handleClose()
        })
        .catch((error: any) => {
          const errorCode = error.code
          showToastError(firebaseErrorCodes(errorCode))
        })
    } else {
      showToastError("Please enter your email address first!")
    }
  }

  return (
    <Layout
      style={{
        width: "100%",
        backgroundColor: "transparent",
        marginBottom: 50,
      }}>
      <Text category="s1" style={TextStyle.subtitle}>
        Reset Password
      </Text>
      <Layout>
        <Input
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={value => {
            setEmail(value)
          }}
          style={{ margin: 10 }}
          disabled={isSaving}
        />
      </Layout>
      <Layout style={[LayoutStyle.rowEvenly, { marginVertical: 20 }]}>
        <Button
          onPress={handlePasswordReset}
          status="warning"
          disabled={isSaving}>
          Send Reset Password
        </Button>
        <Button onPress={handleClose} status="danger" disabled={isSaving}>
          Cancel
        </Button>
      </Layout>

      {isSaving && <Loading />}
    </Layout>
  )
}

export default ResetPassword
