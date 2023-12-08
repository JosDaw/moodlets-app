import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Layout } from "@ui-kitten/components"
import React from "react"
import { TouchableOpacity } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import LayoutStyle from "../styles/Layout"

interface JumpIconProps {
  text: string
  color: string
  handlePress: () => void
}

const JumpIcon = ({ text, color, handlePress }: JumpIconProps) => {
  // translateY will be used to move the icon up and down.
  const translateY = useSharedValue(0)

  const handleSelect = () => {
    // On press, make the icon move up first...
    translateY.value = withSpring(-50, {
      stiffness: 300,
      damping: 5,
      mass: 1,
      overshootClamping: false,
      restSpeedThreshold: 0.001,
      restDisplacementThreshold: 0.001,
    })

    // ... and then fall back down.
    setTimeout(() => {
      translateY.value = withSpring(0)
    }, 200)

    handlePress()
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  return (
    <Layout
      style={[
        LayoutStyle.colCenter,
        { backgroundColor: "transparent", width: "30%" },
      ]}>
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPress={handleSelect}
          style={{
            backgroundColor: "#fff",
            borderRadius: 100,
            padding: 2,
            margin: 10,
          }}>
          <MaterialCommunityIcons
            name={`emoticon-${text}` as any}
            size={75}
            color={color}
          />
        </TouchableOpacity>
      </Animated.View>
    </Layout>
  )
}

export default JumpIcon
