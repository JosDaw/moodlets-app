import { MaterialCommunityIcons } from "@expo/vector-icons"
import Slider from "@react-native-community/slider"
import {
  Button,
  Icon,
  Layout,
  Text,
  useStyleSheet,
} from "@ui-kitten/components"
import { Link, router } from "expo-router"
import { Timestamp, addDoc, collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import originalStatus from "./assets/status.json"
import AnimatedText from "./components/AnimatedText"
import { BottomTabNavigation } from "./components/BottomTabNavigation"
import { default as OpacityView } from "./components/OpacityView"
import { database } from "./config/firebase"
import {
  clearAllScheduledNotificationsExceptDaily,
  scheduleStatusNotification,
} from "./helpers/notifications"
import { fetchStatusData } from "./helpers/statusHelpers"
import { showToastError, showToastSuccess } from "./helpers/toasts"
import {
  getAllNotificationsOnDevice,
  getUser,
  saveStatus,
} from "./helpers/userHelper"
import LayoutStyle from "./styles/Layout"
import TextStyle from "./styles/Text"
import { IStatus } from "./types/types"

// This page will ask users to update their current status for different states
const Status = () => {
  const layout = useStyleSheet(LayoutStyle)

  const [status, setStatus] = useState<IStatus>(originalStatus)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const handleGoToProfile = async () => {
    // Clear all existing notifications first, except daily
    clearAllScheduledNotificationsExceptDaily()

    const user = await getUser()

    // Upload the new statuses to Firebase
    const statusRef = collection(database, "status")
    const statusData = {
      dateCreated: Timestamp.now(),
      status,
      userID: user,
    }
    try {
      await addDoc(statusRef, statusData).then(async () => {
        // Save status locally
        saveStatus({ status: status, dateCreated: Timestamp.now() })

        // Only schedule notifications if they already exist, otherwise do not schedule
        const existingNotifications = await getAllNotificationsOnDevice()

        // Set scheduled notifications based on depletion rate
        for (const key in status) {
          if (Object.prototype.hasOwnProperty.call(status, key)) {
            const element = status[key as keyof IStatus]

            if (existingNotifications.includes(key)) {
              // Schedule notifications for each status
              await scheduleStatusNotification(key, element)
            }
          }
        }

        showToastSuccess("Status changes saved!")

        // Go to profile page
        router.replace("profile")
      })
    } catch (error: any) {
      showToastError("Error updating status data: " + error.message)
      // Go to profile page
      router.replace("profile")
    }
  }

  useEffect(() => {
    if (!isLoaded) {
      fetchStatusData(setStatus, setIsLoaded)
    }
  }, [])

  return (
    <>
      <ScrollView>
        <Layout style={layout.basic}>
          <Text style={[TextStyle.pageTitle]} category="h1">
            Let's Get Specific
          </Text>

          {/* Hunger Section */}
          <Layout style={[layout.colCenter, { marginVertical: 25 }]}>
            <Text style={[TextStyle.title, TextStyle.bold]} category="h3">
              Hunger
            </Text>
            <Layout style={layout.rowCenter}>
              <Text style={[TextStyle.subtitle, TextStyle.bold]} category="s1">
                How full are you?
              </Text>
            </Layout>
            <Layout style={layout.rowCenter}>
              <AnimatedText
                text="Not at all"
                status={status.hunger}
                isInverted={true}
              />
              <Icon
                style={{
                  width: 25,
                  height: 25,
                }}
                fill="#fff"
                name="arrow-forward-outline"
              />

              <AnimatedText text="Completely full" status={status.hunger} />
            </Layout>
            <Layout style={layout.rowCenter}>
              <OpacityView status={status.hunger} isInverted>
                <Layout
                  style={{
                    backgroundColor: "#fff",
                    padding: 1,
                    borderRadius: 100,
                    marginHorizontal: 10,
                  }}>
                  <MaterialCommunityIcons
                    name={`emoticon-sad`}
                    size={20}
                    color="#FF3D71"
                  />
                </Layout>
              </OpacityView>

              <Layout
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: 100,
                  marginTop: 5,
                }}>
                <Slider
                  style={{ width: 200 }}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#00E096"
                  maximumTrackTintColor="#FF3D71"
                  onSlidingComplete={value => {
                    setStatus({ ...status, hunger: value })
                  }}
                  value={status.hunger}
                />
              </Layout>

              <OpacityView status={status.hunger}>
                <Layout
                  style={{
                    backgroundColor: "#fff",
                    padding: 1,
                    borderRadius: 100,
                    marginHorizontal: 10,
                  }}>
                  <MaterialCommunityIcons
                    name={`emoticon-happy`}
                    size={20}
                    color="#00E096"
                  />
                </Layout>
              </OpacityView>
            </Layout>
          </Layout>

          {/* Hydration Section */}
          <Layout style={[layout.colCenter, { marginVertical: 25 }]}>
            <Text style={[TextStyle.title, TextStyle.bold]} category="h3">
              Thirst
            </Text>
            <Layout style={layout.rowCenter}>
              <Text style={[TextStyle.subtitle, TextStyle.bold]} category="s1">
                How hydrated are you?
              </Text>
            </Layout>
            <Layout style={layout.rowCenter}>
              <AnimatedText
                text="Extremely dehydrated"
                status={status.thirst}
                isInverted={true}
              />
              <Icon
                style={{
                  width: 25,
                  height: 25,
                }}
                fill="#fff"
                name="arrow-forward-outline"
              />

              <AnimatedText text="Very hydrated" status={status.thirst} />
            </Layout>

            <Layout style={layout.rowCenter}>
              <OpacityView status={status.thirst} isInverted>
                <Layout
                  style={{
                    backgroundColor: "#fff",
                    padding: 1,
                    borderRadius: 100,
                    marginHorizontal: 10,
                  }}>
                  <MaterialCommunityIcons
                    name={`emoticon-sad`}
                    size={20}
                    color="#FF3D71"
                  />
                </Layout>
              </OpacityView>
              <Layout
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: 100,
                  marginTop: 5,
                }}>
                <Slider
                  style={{ width: 200, height: 40 }}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#00E096"
                  maximumTrackTintColor="#FF3D71"
                  onSlidingComplete={value => {
                    setStatus({ ...status, thirst: value })
                  }}
                  value={status.thirst}
                />
              </Layout>

              <OpacityView status={status.thirst}>
                <Layout
                  style={{
                    backgroundColor: "#fff",
                    padding: 1,
                    borderRadius: 100,
                    marginHorizontal: 10,
                  }}>
                  <MaterialCommunityIcons
                    name={`emoticon-happy`}
                    size={20}
                    color="#00E096"
                  />
                </Layout>
              </OpacityView>
            </Layout>
          </Layout>

          {/* Hygiene Section */}
          <Layout style={[layout.colCenter, { marginVertical: 25 }]}>
            <Text style={[TextStyle.title, TextStyle.bold]} category="h3">
              Hygiene
            </Text>
            <Layout style={layout.rowCenter}>
              <Text style={[TextStyle.subtitle, TextStyle.bold]} category="s1">
                How clean do you feel?
              </Text>
            </Layout>
            <Layout style={layout.rowCenter}>
              <AnimatedText
                text="Filthy"
                status={status.hygiene}
                isInverted={true}
              />
              <Icon
                style={{
                  width: 25,
                  height: 25,
                }}
                fill="#fff"
                name="arrow-forward-outline"
              />

              <AnimatedText text="Spotless" status={status.hygiene} />
            </Layout>

            <Layout style={layout.rowCenter}>
              <OpacityView status={status.hygiene} isInverted>
                <Layout
                  style={{
                    backgroundColor: "#fff",
                    padding: 1,
                    borderRadius: 100,
                    marginHorizontal: 10,
                  }}>
                  <MaterialCommunityIcons
                    name={`emoticon-sad`}
                    size={20}
                    color="#FF3D71"
                  />
                </Layout>
              </OpacityView>

              <Layout
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: 100,
                  marginTop: 5,
                }}>
                <Slider
                  style={{ width: 200, height: 40 }}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#00E096"
                  maximumTrackTintColor="#FF3D71"
                  onSlidingComplete={value => {
                    setStatus({ ...status, hygiene: value })
                  }}
                  value={status.hygiene}
                />
              </Layout>

              <OpacityView status={status.hygiene}>
                <Layout
                  style={{
                    backgroundColor: "#fff",
                    padding: 1,
                    borderRadius: 100,
                    marginHorizontal: 10,
                  }}>
                  <MaterialCommunityIcons
                    name={`emoticon-happy`}
                    size={20}
                    color="#00E096"
                  />
                </Layout>
              </OpacityView>
            </Layout>
          </Layout>

          {/* Energy Section */}
          <Layout style={[layout.colCenter, { marginVertical: 25 }]}>
            <Text style={[TextStyle.title, TextStyle.bold]} category="h3">
              Energy
            </Text>
            <Layout style={layout.rowCenter}>
              <Text style={[TextStyle.subtitle, TextStyle.bold]} category="s1">
                How tired do you feel?
              </Text>
            </Layout>
            <Layout style={layout.rowCenter}>
              <AnimatedText
                text="Exhausted"
                status={status.energy}
                isInverted={true}
              />
              <Icon
                style={{
                  width: 25,
                  height: 25,
                }}
                fill="#fff"
                name="arrow-forward-outline"
              />

              <AnimatedText text="Well-rested" status={status.energy} />
            </Layout>

            <Layout style={layout.rowCenter}>
              <OpacityView status={status.energy} isInverted>
                <Layout
                  style={{
                    backgroundColor: "#fff",
                    padding: 1,
                    borderRadius: 100,
                    marginHorizontal: 10,
                  }}>
                  <MaterialCommunityIcons
                    name={`emoticon-sad`}
                    size={20}
                    color="#FF3D71"
                  />
                </Layout>
              </OpacityView>

              <Layout
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: 100,
                  marginTop: 5,
                }}>
                <Slider
                  style={{ width: 200, height: 40 }}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#00E096"
                  maximumTrackTintColor="#FF3D71"
                  onSlidingComplete={value => {
                    setStatus({ ...status, energy: value })
                  }}
                  value={status.energy}
                />
              </Layout>

              <OpacityView status={status.energy}>
                <Layout
                  style={{
                    backgroundColor: "#fff",
                    padding: 1,
                    borderRadius: 100,
                    marginHorizontal: 10,
                  }}>
                  <MaterialCommunityIcons
                    name={`emoticon-happy`}
                    size={20}
                    color="#00E096"
                  />
                </Layout>
              </OpacityView>
            </Layout>
          </Layout>

          {/* Social Section */}
          <Layout style={[layout.colCenter, { marginVertical: 25 }]}>
            <Text style={[TextStyle.title, TextStyle.bold]} category="h3">
              Social
            </Text>
            <Layout style={layout.rowCenter}>
              <Text style={[TextStyle.subtitle, TextStyle.bold]} category="s1">
                How lonely do you feel?
              </Text>
            </Layout>

            <Layout style={layout.rowCenter}>
              <AnimatedText
                text="Extremely isolated"
                status={status.social}
                isInverted={true}
              />
              <Icon
                style={{
                  width: 25,
                  height: 25,
                }}
                fill="#fff"
                name="arrow-forward-outline"
              />

              <AnimatedText text="Not at all" status={status.social} />
            </Layout>

            <Layout style={layout.rowCenter}>
              <OpacityView status={status.social} isInverted>
                <Layout
                  style={{
                    backgroundColor: "#fff",
                    padding: 1,
                    borderRadius: 100,
                    marginHorizontal: 10,
                  }}>
                  <MaterialCommunityIcons
                    name={`emoticon-sad`}
                    size={20}
                    color="#FF3D71"
                  />
                </Layout>
              </OpacityView>

              <Layout
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: 100,
                  marginTop: 5,
                }}>
                <Slider
                  style={{ width: 200, height: 40 }}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#00E096"
                  maximumTrackTintColor="#FF3D71"
                  onSlidingComplete={value => {
                    setStatus({ ...status, social: value })
                  }}
                  value={status.social}
                />
              </Layout>

              <OpacityView status={status.social}>
                <Layout
                  style={{
                    backgroundColor: "#fff",
                    padding: 1,
                    borderRadius: 100,
                    marginHorizontal: 10,
                  }}>
                  <MaterialCommunityIcons
                    name={`emoticon-happy`}
                    size={20}
                    color="#00E096"
                  />
                </Layout>
              </OpacityView>
            </Layout>
          </Layout>

          {/* Fun Section */}
          <Layout style={[layout.colCenter, { marginVertical: 25 }]}>
            <Text style={[TextStyle.title, TextStyle.bold]} category="h3">
              Fun
            </Text>
            <Layout style={layout.rowCenter}>
              <Text style={[TextStyle.subtitle, TextStyle.bold]} category="s1">
                How bored are you?
              </Text>
            </Layout>
            <Layout style={layout.rowCenter}>
              <AnimatedText
                text="Extremely"
                status={status.fun}
                isInverted={true}
              />
              <Icon
                style={{
                  width: 25,
                  height: 25,
                }}
                fill="#fff"
                name="arrow-forward-outline"
              />
              <AnimatedText text="Not at all" status={status.fun} />
            </Layout>

            <Layout style={layout.rowCenter}>
              <OpacityView status={status.fun} isInverted>
                <Layout
                  style={{
                    backgroundColor: "#fff",
                    padding: 1,
                    borderRadius: 100,
                    marginHorizontal: 10,
                  }}>
                  <MaterialCommunityIcons
                    name={`emoticon-sad`}
                    size={20}
                    color="#FF3D71"
                  />
                </Layout>
              </OpacityView>

              <Layout
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: 100,
                  marginTop: 5,
                }}>
                <Slider
                  style={{ width: 200, height: 40 }}
                  minimumValue={0}
                  maximumValue={1}
                  minimumTrackTintColor="#00E096"
                  maximumTrackTintColor="#FF3D71"
                  onSlidingComplete={value => {
                    setStatus({ ...status, fun: value })
                  }}
                  value={status.fun}
                />
              </Layout>

              <OpacityView status={status.fun}>
                <Layout
                  style={{
                    backgroundColor: "#fff",
                    padding: 1,
                    borderRadius: 100,
                    marginHorizontal: 10,
                  }}>
                  <MaterialCommunityIcons
                    name={`emoticon-happy`}
                    size={20}
                    color="#00E096"
                  />
                </Layout>
              </OpacityView>
            </Layout>
          </Layout>

          {/* Navigation */}
          <Layout style={[layout.rowEvenly, { marginVertical: 25 }]}>
            <Link href="/moodlet" asChild>
              <Button
                style={{ margin: 10 }}
                status="warning"
                size={"large"}
                accessoryLeft={<Icon name="arrow-back-outline" />}>
                Go Back
              </Button>
            </Link>

            <Button
              onPress={handleGoToProfile}
              style={{ margin: 10 }}
              status="danger"
              size={"large"}
              accessoryLeft={<Icon name="save-outline" />}>
              Save
            </Button>
          </Layout>

          <Button
            onPress={() => {
              setStatus(originalStatus)
            }}>
            Reset All
          </Button>
        </Layout>
      </ScrollView>
      <BottomTabNavigation currentSelected={0} />
    </>
  )
}

export default Status
