import { Icon } from "@ui-kitten/components"
import { TouchableWithoutFeedback } from "react-native"

interface PasswordIconProps {
  showPassword: boolean
  setShowPassword: (showPassword: boolean) => void
  props?: any
}

const PasswordIcon = ({
  showPassword,
  setShowPassword,
  props,
}: PasswordIconProps) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setShowPassword(!showPassword)
      }}>
      <Icon {...props} name={showPassword ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  )
}

export default PasswordIcon
