import {
  Button,
  Icon,
  Input,
  Layout,
  Text,
  useStyleSheet,
} from "@ui-kitten/components"
import LayoutStyle from "../styles/Layout"
import TextStyle from "../styles/Text"
import Loading from "./Loading"

interface AddFriendProps {
  friendsCode: string
  setFriendsCode: (friendsCode: string) => void
  handleFriendCode: () => void
  isSaving: boolean
}

const AddFriend = ({
  friendsCode,
  isSaving,
  setFriendsCode,
  handleFriendCode,
}: AddFriendProps) => {
  const layout = useStyleSheet(LayoutStyle)
  return (
    <>
      <Text style={[TextStyle.subtitle, TextStyle.bold]} category="h4">
        Add Your Friends
      </Text>
      <Layout
        style={[layout.colLeft, { paddingHorizontal: 20, marginVertical: 15 }]}>
        <Input
          label="Add Friend's Code"
          placeholder="FRIEND123"
          value={friendsCode}
          onChangeText={value => {
            setFriendsCode(value.trim())
          }}
          disabled={isSaving}
          autoCapitalize={"characters"}
        />
        <Button
          style={{ marginTop: 20 }}
          status="info"
          accessoryLeft={<Icon name="person-add-outline" />}
          onPress={handleFriendCode}
          disabled={isSaving}>
          Add Friend
        </Button>
        {isSaving && <Loading />}
      </Layout>
    </>
  )
}

export default AddFriend
