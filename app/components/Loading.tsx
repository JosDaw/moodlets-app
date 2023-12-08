import { Layout, Spinner, Text } from "@ui-kitten/components"
import LayoutStyle from "../styles/Layout"

const Loading = () => {
  return (
    <Layout style={[LayoutStyle.colCenter, { marginVertical: 20 }]}>
      <Text category="s1" status="basic" style={{ marginBottom: 10 }}>
        Loading
      </Text>
      <Spinner status="basic" size="giant" />
    </Layout>
  )
}

export default Loading
