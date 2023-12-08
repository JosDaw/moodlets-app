import { Button, Layout, Text, useStyleSheet } from "@ui-kitten/components"
import { Link } from "expo-router"
import { statusFeeling, statusRecommendation } from "../helpers/statusHelpers"
import LayoutStyle from "../styles/Layout"
import TextStyle from "../styles/Text"

interface RecommendationsProps {
  lowestStatus: string
}

const Recommendations = ({ lowestStatus }: RecommendationsProps) => {
  const layout = useStyleSheet(LayoutStyle)
  return (
    <Layout
      style={[
        layout.colCenter,
        {
          backgroundColor: "#fff",
          marginTop: 25,
          paddingBottom: 15,
          borderRadius: 25,
          paddingHorizontal: 15,
        },
      ]}>
      <Text category="h4" style={[TextStyle.title, TextStyle.bold]}>
        Recommendations
      </Text>
      <Text category="s1" style={[{ marginVertical: 10 }]}>
        You might be feeling{" "}
        <Text style={[TextStyle.bold, { color: "#DB2C66" }]}>
          {statusFeeling(lowestStatus)}
        </Text>
        .
      </Text>
      <Text category="p1" style={TextStyle.text}>
        {statusRecommendation(lowestStatus)}
      </Text>
      <Link href="/moodlet" asChild style={{ marginTop: 10 }}>
        <Button size={"small"} status="warning">{`Not ${statusFeeling(
          lowestStatus,
        )}? Update your mood!`}</Button>
      </Link>
    </Layout>
  )
}

export default Recommendations
