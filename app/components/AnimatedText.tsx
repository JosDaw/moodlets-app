import React, { useEffect, useState } from "react"
import { Animated } from "react-native"

interface AnimatedTextProps {
  status: number
  text: string
  isInverted?: boolean
}

const AnimatedText = ({ status, text, isInverted }: AnimatedTextProps) => {
  const [fadeAnim] = useState(new Animated.Value(0.5)) // Initial value for opacity

  useEffect(() => {
    const targetOpacity = isInverted
      ? Math.max(1 - status, 0.4) // Inverted, with a minimum of 0.2
      : Math.max(status, 0.4)

    Animated.timing(fadeAnim, {
      toValue: targetOpacity, // Target opacity value
      duration: 200, // Duration of the animation (in ms)
      useNativeDriver: false, // Use native driver for performance
    }).start()
  }, [status, fadeAnim, isInverted]) // Re-run effect when status changes

  return (
    <Animated.Text
      style={{ opacity: fadeAnim, fontFamily: "Raleway_400Regular" }}>
      {text}
    </Animated.Text>
  )
}

export default AnimatedText
