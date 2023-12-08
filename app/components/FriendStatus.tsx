import { MaterialCommunityIcons } from "@expo/vector-icons"
import {
  Button,
  Icon,
  Layout,
  Text,
  useStyleSheet,
} from "@ui-kitten/components"
import React from "react"
import { calculateColorIndexMood } from "../helpers/statusHelpers"
import LayoutStyle from "../styles/Layout"
import TextStyle from "../styles/Text"
import { IFriendStatus } from "../types/types"
import DetailedStatus from "./DetailedStatus"

interface FriendStatusProps {
  friendStatus: IFriendStatus
  removeFriendCode: (friendCode: string) => void
}

const FriendStatus = ({
  friendStatus,
  removeFriendCode,
}: FriendStatusProps) => {
  const layout = useStyleSheet(LayoutStyle)

  return (
    <Layout
      style={[
        layout.colCenter,
        { backgroundColor: "#94CBFF", paddingVertical: 20 },
      ]}>
      <Layout style={[layout.rowCenter]}>
        <Layout
          style={{
            backgroundColor: "white",
            borderRadius: 100,
            marginRight: 10,
          }}>
          <MaterialCommunityIcons
            name={`emoticon-${friendStatus.mood}` as any}
            size={35}
            color={calculateColorIndexMood(friendStatus.mood)}
          />
        </Layout>
        <Text category="h4" style={[TextStyle.subtitle, TextStyle.bold]}>
          {friendStatus.name}
        </Text>
      </Layout>
      <DetailedStatus status={friendStatus.status} size={30} barSize={85} />
      <Text style={TextStyle.subtitle}>
        Last Updated: {friendStatus.dateCreated}
      </Text>
      <Button
        style={{ marginTop: 10 }}
        status="danger"
        accessoryLeft={<Icon name="person-delete-outline" />}
        onPress={() => {
          removeFriendCode(friendStatus.friendCode)
        }}>
        Remove
      </Button>
    </Layout>
  )
}

export default FriendStatus
