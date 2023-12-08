import {
  Button,
  Icon,
  Layout,
  Text,
  ViewPager,
  useStyleSheet,
} from "@ui-kitten/components"
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import { SetStateAction, useEffect, useState } from "react"
import statusColors from "./assets/statusColors.json"
import { BottomTabNavigation } from "./components/BottomTabNavigation"
import Loading from "./components/Loading"
import MoodChart from "./components/MoodChart"
import StatusLinechart from "./components/StatusLinechart"
import { database } from "./config/firebase"
import { showToastError } from "./helpers/toasts"
import { getUser } from "./helpers/userHelper"
import LayoutStyle from "./styles/Layout"
import TextStyle from "./styles/Text"
import { IMoodChartItem } from "./types/types"

// Show user chart
export default function Page() {
  const layout = useStyleSheet(LayoutStyle)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [allMoodData, setAllMoodData] = useState<IMoodChartItem[]>()
  const [allStatusData, setAllStatusData] = useState<any>()
  const [activeLine, setActiveLine] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [hasNoData, setHasNoData] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  const handleActiveline = (line: string | null) => {
    setActiveLine(line)
  }

  /**
   * Load historic mood and status data for user
   */
  useEffect(() => {
    const fetchAllMoodData = async () => {
      await getUser().then(async user => {
        if (user) {
          setIsLoggedIn(true)
          try {
            const moodQuery = query(
              collection(database, "mood"),
              where("userID", "==", user),
              orderBy("dateCreated", "desc"),
              limit(100),
            )

            const querySnapshot = await getDocs(moodQuery)
            let dataArray: { mood: any; date: any }[] = []

            if (!querySnapshot.empty) {
              querySnapshot.forEach(doc => {
                dataArray.push({
                  mood: doc.data().mood,
                  date: doc.data().dateCreated.toDate().toString(),
                })
              })

              setAllMoodData(dataArray as IMoodChartItem[])
            } else {
              // No matching document found
              showToastError(
                `Don't forget to update your moodlets to see your charts!`,
              )
            }
          } catch (error: any) {
            showToastError("Error fetching mood data: " + error.message)
          }
        } else {
          setIsLoaded(true)
          showToastError("Please sign up to see chart data.")
        }
      })
    }

    const fetchAllStatusData = async () => {
      await getUser().then(async user => {
        if (user) {
          try {
            const statusQuery = query(
              collection(database, "status"),
              where("userID", "==", user),
              orderBy("dateCreated", "desc"),
              limit(100),
            )

            const querySnapshot = await getDocs(statusQuery)
            let dataArray: { status: any; date: any }[] = []

            if (!querySnapshot.empty) {
              querySnapshot.forEach(doc => {
                dataArray.push({
                  status: doc.data().status,
                  date: doc.data().dateCreated.toDate().toString(),
                })
              })

              setAllStatusData(dataArray)
              setIsLoaded(true)
            } else {
              setHasNoData(true)
            }
          } catch (error: any) {
            showToastError("Error fetching mood data: " + error.message)
          }
        }
      })
    }

    if (!isLoaded) {
      fetchAllMoodData()
      fetchAllStatusData()
    }
  }, [])

  return (
    <>
      <ViewPager
        selectedIndex={selectedIndex}
        onSelect={(index: SetStateAction<number>) => setSelectedIndex(index)}
        style={layout.basic}>
        <Layout level="2" style={layout.basic}>
          <Text style={[TextStyle.pageTitle]} category="h1">
            Historic Moodlets
          </Text>
          {hasNoData ? (
            <Text style={TextStyle.subtitle}>
              Update your moodlets to show data!
            </Text>
          ) : !isLoaded ? (
            <Loading />
          ) : (
            <>
              {allMoodData && <MoodChart allMoodData={allMoodData} />}
              {isLoggedIn && allStatusData.length > 1 ? (
                <Text style={TextStyle.text}>(Swipe to see more!)</Text>
              ) : (
                <Text style={TextStyle.text}>
                  (Update your moodlets to see charts!)
                </Text>
              )}
            </>
          )}
        </Layout>

        <Layout level="2" style={layout.basic}>
          <Text style={[TextStyle.pageTitle]} category="h1">
            Historic Statuses
          </Text>
          {isLoggedIn && allStatusData && allStatusData.length > 1 && (
            <>
              <StatusLinechart data={allStatusData} activeLine={activeLine} />
              <Layout style={[layout.rowEvenly, { marginVertical: 10 }]}>
                {Object.keys(statusColors).map(status => (
                  <Button
                    key={status}
                    onPress={() => handleActiveline(status)}
                    style={{
                      margin: 6,
                      backgroundColor:
                        statusColors[status as keyof typeof statusColors],
                      borderColor:
                        statusColors[status as keyof typeof statusColors],
                      width: 100,
                    }}>
                    {evaProps => (
                      <Text
                        {...evaProps}
                        style={[
                          TextStyle.text,
                          TextStyle.bold,
                          { color: "#000" },
                        ]}>
                        {status}
                      </Text>
                    )}
                  </Button>
                ))}
                <Button
                  onPress={() => {
                    handleActiveline(null)
                  }}
                  accessoryLeft={<Icon name="refresh-outline" />}
                  style={{ marginTop: 10 }}>
                  Reset
                </Button>
              </Layout>
            </>
          )}
        </Layout>
      </ViewPager>
      <BottomTabNavigation currentSelected={3} />
    </>
  )
}
