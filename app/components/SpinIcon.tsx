import { IStatus } from "@/types/types"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useEffect } from "react"
import { TouchableOpacity } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { calculateColorIndexMood } from "../helpers/statusHelpers"

interface SpinIconProps {
  handlePress: () => void
  moodData: string
  status: IStatus
}

const SpinIcon = ({ handlePress, moodData, status }: SpinIconProps) => {
  const rotateValue = useSharedValue(0)

  const spinAnimation = () => {
    // Start from 0° and spin to 360°.
    rotateValue.value = withTiming(
      360,
      {
        duration: 500, // Duration for one complete rotation
        easing: Easing.linear,
      },
      // Callback after the animation ends to reset value
      () => {
        rotateValue.value = 0
      },
    )
  }

  useEffect(() => {
    // Spin on initial load
    spinAnimation()
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateValue.value}deg` }],
    }
  })

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={{ backgroundColor: "white", borderRadius: 100 }}
        onPress={() => {
          spinAnimation()
          handlePress()
        }}>
        <MaterialCommunityIcons
          name={`emoticon-${moodData}` as any}
          size={115}
          color={calculateColorIndexMood(moodData)}
        />
      </TouchableOpacity>
    </Animated.View>
  )
}

export default SpinIcon
