import { Layout, Text, useStyleSheet } from "@ui-kitten/components"
import { router } from "expo-router"
import { useEffect } from "react"
import Loading from "./components/Loading"
import { getUser } from "./helpers/userHelper"
import LayoutStyle from "./styles/Layout"
import TextStyle from "./styles/Text"

// Redirect user
export default function Page() {
  const layout = useStyleSheet(LayoutStyle)

  /**
   * Navigate based on existing user info
   */
  useEffect(() => {
    async function navigateUser() {
      const user = await getUser()

      if (user) {
        router.push("/profile")
      } else {
        router.push("/signup?type=basic")
      }
    }

    navigateUser()
  }, [])

  return (
    <Layout style={layout.basic}>
      <Text style={[TextStyle.pageTitle]} category="h1">
        Welcome to Moodlets
      </Text>
      <Loading />
    </Layout>
  )
}
