import * as eva from "@eva-design/eva"
import {
  Raleway_400Regular,
  Raleway_700Bold,
  useFonts,
} from "@expo-google-fonts/raleway"
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components"
import { EvaIconsPack } from "@ui-kitten/eva-icons"
import Constants from "expo-constants"
import { Slot, SplashScreen } from "expo-router"
import { useEffect } from "react"
import { RootSiblingParent } from "react-native-root-siblings"
import * as Sentry from "sentry-expo"

Sentry.init({
  dsn: Constants?.expoConfig?.extra?.EXPO_PUBLIC_SENTRY,
  enableInExpoDevelopment: true,
  debug: process.env.NODE_ENV === "development",
  tracesSampleRate: 1.0,
})

SplashScreen.preventAutoHideAsync()

function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Raleway_400Regular,
    Raleway_700Bold,
  })

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  // Prevent rendering until the font has loaded or an error was returned
  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <RootSiblingParent>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <Slot />
      </ApplicationProvider>
    </RootSiblingParent>
  )
}

export default RootLayout
