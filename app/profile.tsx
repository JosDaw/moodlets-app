import {
  Button,
  Icon,
  Layout,
  Text,
  useStyleSheet,
} from "@ui-kitten/components"
import { Link } from "expo-router"
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import originalStatus from "./assets/status.json"
import { BottomTabNavigation } from "./components/BottomTabNavigation"
import DetailedStatus from "./components/DetailedStatus"
import Heart from "./components/Heart"
import Loading from "./components/Loading"
import MoodletIcons from "./components/MoodletIcons"
import Recommendations from "./components/Recommendations"
import SpinIcon from "./components/SpinIcon"
import { database } from "./config/firebase"
import {
  decreaseValuesBasedOnTime,
  isMoreThanOneHourOld,
  showAsTime,
} from "./helpers/dateTimeHelpers"
import {
  calculateColorIndexStatus,
  getLowestStatusKey,
} from "./helpers/statusHelpers"
import { showToastError } from "./helpers/toasts"
import { getMood, getStatus, getUser } from "./helpers/userHelper"
import LayoutStyle from "./styles/Layout"
import TextStyle from "./styles/Text"
import { IStatus } from "./types/types"

// This page will show the user's current status/mood
export default function Page() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [moodData, setMoodData] = useState<string>("happy")
  const [status, setStatus] = useState<IStatus>(originalStatus)
  const [showStatusDetails, setShowStatusDetails] = useState<boolean>(true)
  const [showMoodDetails, setShowMoodDetails] = useState<boolean>(false)
  const [statusUpdatedTime, setStatusUpdatedTime] = useState<string>("")
  const [lowestStatus, setLowestStatus] = useState<string>("")
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const layout = useStyleSheet(LayoutStyle)


  // Load the latest mood/status data
  useEffect(() => {
    const fetchMoodData = async () => {
      await getUser().then(async user => {
        if (user !== null) {
          try {
            setIsLoggedIn(true)

            const storedMood = await getMood()

            // If the mood is stored, use that
            if (storedMood) {
              setMoodData(storedMood)
            } else {
              const moodQuery = query(
                collection(database, "mood"),
                where("userID", "==", user),
                orderBy("dateCreated", "desc"),
                limit(1),
              )

              const querySnapshot = await getDocs(moodQuery)

              if (!querySnapshot.empty) {
                const moodDoc = querySnapshot.docs[0]
                const moodData = moodDoc.data().mood || "neutral"

                // Set the mood data
                setMoodData(moodData)
              } else {
                // No matching document found
                showToastError(`Don't forget to update your moodlets!`)
              }
            }
          } catch (error: any) {
            showToastError("Error fetching your info. Please log in again.")
          }
        } else {
          setIsLoggedIn(false)
          setIsLoaded(true)
        }
      })
    }

    const fetchStatusData = async () => {
      await getUser().then(async user => {
        if (user) {
          const storedStatus = await getStatus()

          // If the status is stored, use that
          if (storedStatus) {
            let currentStatus = storedStatus.status

            if (isMoreThanOneHourOld(storedStatus.dateCreated)) {
              currentStatus = decreaseValuesBasedOnTime(
                storedStatus.dateCreated,
                status,
              )
            }

            const lowest = getLowestStatusKey(currentStatus)
            setStatus(currentStatus)
            setLowestStatus(lowest.toString())
            setStatusUpdatedTime(showAsTime(storedStatus.dateCreated.seconds))
            setIsLoaded(true)
          } else {
            try {
              const statusQuery = query(
                collection(database, "status"),
                where("userID", "==", user),
                orderBy("dateCreated", "desc"),
                limit(1),
              )

              const querySnapshot = await getDocs(statusQuery)

              if (!querySnapshot.empty) {
                const statusDoc = querySnapshot.docs[0]
                const { status: statusData, dateCreated } = statusDoc.data()

                let currentStatus = statusData

                if (isMoreThanOneHourOld(dateCreated)) {
                  currentStatus = decreaseValuesBasedOnTime(dateCreated, status)
                }

                const lowest = getLowestStatusKey(currentStatus)
                setStatus(currentStatus)
                setLowestStatus(lowest.toString())
                setStatusUpdatedTime(showAsTime(dateCreated.seconds))
              }

              setIsLoaded(true)
            } catch (error: any) {
              showToastError("Error fetching status data: " + error.message)
            }
          }
        }
      })
    }

    if (!isLoaded) {
      fetchMoodData()
      fetchStatusData()
    }
  }, [status, isLoaded])

  return (
    <>
      <ScrollView style={{ backgroundColor: "#94CBFF" }}>
        <Layout style={layout.basic}>
          <Text style={[TextStyle.pageTitle]} category="h1">
            Your Moodlets
          </Text>
          {isLoaded ? (
            <>
              <Layout style={layout.rowEvenly}>
                <Layout style={{ backgroundColor: "transparent" }}>
                  <SpinIcon
                    handlePress={() => {
                      setShowMoodDetails(!showMoodDetails)
                    }}
                    moodData={moodData}
                    status={status}
                  />
                  {showMoodDetails && (
                    <Text style={[TextStyle.title]} category="h4">
                      {moodData}
                    </Text>
                  )}
                </Layout>
                <Heart
                  color={calculateColorIndexStatus(status)}
                  handlePress={() => {
                    setShowStatusDetails(!showStatusDetails)
                  }}
                />
              </Layout>
              <Layout style={[layout.rowCenter, { marginVertical: 10 }]}>
                {Object.entries(status).map(([key, value]) => {
                  if (value > 0.95 || value < 0.3) {
                    return (
                      <MoodletIcons
                        status={key}
                        isFull={value > 0.95}
                        key={key}
                      />
                    )
                  }
                  return null
                })}
              </Layout>
            </>
          ) : (
            <Loading />
          )}

          {isLoaded ? (
            <>
              <Text category="p1" style={TextStyle.text}>
                (Click heart to {showStatusDetails ? "hide" : "show"} details)
              </Text>

              {showStatusDetails && (
                <>
                  <DetailedStatus status={status} />
                  {lowestStatus && (
                    <Recommendations lowestStatus={lowestStatus} />
                  )}
                </>
              )}
            </>
          ) : (
            <Loading />
          )}

          <Text category="s2" style={{ marginTop: 20 }}>
            Last Updated: {statusUpdatedTime || "Never"}
          </Text>

          <Layout style={[layout.rowEvenly, { marginTop: 20 }]}>
            {isLoggedIn ? (
              <>
                <Link href="/settings" asChild>
                  <Button
                    status="info"
                    size={"small"}
                    accessoryLeft={<Icon name="settings-2-outline" />}>
                    Settings
                  </Button>
                </Link>
                <Link href="/chart" asChild>
                  <Button
                    status="success"
                    size={"small"}
                    accessoryLeft={<Icon name="activity-outline" />}>
                    Historic Moodlets
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/signup" asChild>
                <Button
                  status="danger"
                  size={"giant"}
                  accessoryLeft={<Icon name="log-in-outline" />}>
                  Sign up
                </Button>
              </Link>
            )}
          </Layout>
        </Layout>
      </ScrollView>
      <BottomTabNavigation currentSelected={1} />
    </>
  )
}
function listAllScheduledNotificationsAsync() {
  throw new Error("Function not implemented.")
}
