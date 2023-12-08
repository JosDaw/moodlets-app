import { Layout, Text, useStyleSheet } from "@ui-kitten/components"

import { IStatus } from "@/types/types"
import LayoutStyle from "../styles/Layout"
import { BarStatus } from "./BarStatus"

interface DetailedStatusProps {
  status: IStatus
  size?: number
  barSize?: number
}

const DetailedStatus = ({
  status,
  size = 50,
  barSize = 120,
}: DetailedStatusProps) => {
  const layout = useStyleSheet(LayoutStyle)

  return (
    <Layout style={[layout.rowEvenly, { marginVertical: 10 }]}>
      <Layout
        style={[layout.colCenter, { marginVertical: 10, width: `${size}%` }]}>
        <Text category="s1">Hunger</Text>
        <BarStatus progress={status.hunger} barSize={barSize} />
      </Layout>
      <Layout
        style={[layout.colCenter, { marginVertical: 10, width: `${size}%` }]}>
        <Text category="s1">Thirst</Text>
        <BarStatus progress={status.thirst} barSize={barSize} />
      </Layout>
      <Layout
        style={[layout.colCenter, { marginVertical: 10, width: `${size}%` }]}>
        <Text category="s1">Hygiene</Text>
        <BarStatus progress={status.hygiene} barSize={barSize} />
      </Layout>
      <Layout
        style={[layout.colCenter, { marginVertical: 10, width: `${size}%` }]}>
        <Text category="s1">Energy</Text>
        <BarStatus progress={status.energy} barSize={barSize} />
      </Layout>
      <Layout
        style={[layout.colCenter, { marginVertical: 10, width: `${size}%` }]}>
        <Text category="s1">Social</Text>
        <BarStatus progress={status.social} barSize={barSize} />
      </Layout>
      <Layout
        style={[layout.colCenter, { marginVertical: 10, width: `${size}%` }]}>
        <Text category="s1">Fun</Text>
        <BarStatus progress={status.fun} barSize={barSize} />
      </Layout>
    </Layout>
  )
}

export default DetailedStatus
