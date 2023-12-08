import { Icon } from "@ui-kitten/components"
import React, { useEffect, useRef } from "react"
import { Animated, StyleSheet, TouchableOpacity } from "react-native"

interface HeartProps {
  color: string
  handlePress: () => void
}

const Heart = ({ color, handlePress }: HeartProps) => {
  const anim = useRef(new Animated.Value(1))

  useEffect(() => {
    // Loop the animation
    Animated.loop(
      // Run in this order
      Animated.sequence([
        // Scale up
        Animated.timing(anim.current, {
          toValue: 1.3,
          duration: 2000,
          useNativeDriver: false,
        }),
        // Scale down
        Animated.timing(anim.current, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    ).start()
  }, [])

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Animated.View
        style={[
          {
            transform: [{ scale: anim.current }],
          },
        ]}>
        <Icon
          style={{
            width: 100,
            height: 100,
          }}
          fill={color}
          name="heart"
        />
      </Animated.View>
    </TouchableOpacity>
  )
}

export default Heart

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "white",
    borderRadius: 100,
  },
})
