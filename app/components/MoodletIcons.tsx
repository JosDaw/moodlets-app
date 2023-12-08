import { Layout, Text } from "@ui-kitten/components"
import { Image } from "expo-image"
import { useState } from "react"
import { TouchableOpacity } from "react-native"
import TextStyle from "../styles/Text"

interface MoodletIconsProps {
  status: string
  isFull?: boolean
}

const MoodletIcons = ({ status, isFull = true }: MoodletIconsProps) => {
  const [showText, setShowText] = useState<boolean>(false)
  const blurhash = isFull
    ? "LDF8eDFt3,]C$_JTrwxG3lai{MOS"
    : "LFRQwhs.{8njKPbH#layMlaztej@"

  const getIcon = (status: string, isFull: boolean) => {
    switch (status) {
      case "hunger":
        return isFull
          ? require("../../assets/moodlets-icons/full-hunger.png")
          : require("../../assets/moodlets-icons/empty-hunger.png")
      case "energy":
        return isFull
          ? require("../../assets/moodlets-icons/full-energy.png")
          : require("../../assets/moodlets-icons/empty-energy.png")
      case "social":
        return isFull
          ? require("../../assets/moodlets-icons/full-social.png")
          : require("../../assets/moodlets-icons/empty-social.png")
      case "hygiene":
        return isFull
          ? require("../../assets/moodlets-icons/full-hygiene.png")
          : require("../../assets/moodlets-icons/empty-hygiene.png")
      case "fun":
        return isFull
          ? require("../../assets/moodlets-icons/full-fun.png")
          : require("../../assets/moodlets-icons/empty-fun.png")
      case "thirst":
        return isFull
          ? require("../../assets/moodlets-icons/full-thirst.png")
          : require("../../assets/moodlets-icons/empty-thirst.png")
      default:
        return require("../../assets/moodlets-icons/full-hunger.png")
    }
  }

  return (
    <TouchableOpacity
      onPress={() => {
        setShowText(!showText)
      }}>
      <Layout
        style={{
          padding: 5,
          backgroundColor: "#fff",
          borderRadius: 10,
          margin: 5,
        }}>
        {showText && (
          <Text style={[TextStyle.subtitle, TextStyle.bold]}>{status}</Text>
        )}
        <Image
          source={getIcon(status, isFull)}
          placeholder={blurhash}
          contentFit="cover"
          transition={1000}
          style={{ width: 75, height: 75, borderRadius: 10 }}
        />
      </Layout>
    </TouchableOpacity>
  )
}

export default MoodletIcons
