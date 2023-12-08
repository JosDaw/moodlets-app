import {
  Button,
  Divider,
  Icon,
  Layout,
  Text,
  useStyleSheet,
} from "@ui-kitten/components"
import { Link } from "expo-router"
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import AddFriend from "./components/AddFriend"
import { BottomTabNavigation } from "./components/BottomTabNavigation"
import FriendStatus from "./components/FriendStatus"
import Loading from "./components/Loading"
import { database } from "./config/firebase"
import {
  decreaseValuesBasedOnTime,
  isMoreThanOneHourOld,
  showAsDateTime,
} from "./helpers/dateTimeHelpers"
import { generateUniqueCode } from "./helpers/helpers"
import { showToastError } from "./helpers/toasts"
import { getUser, getUserCode, saveUserCode } from "./helpers/userHelper"
import LayoutStyle from "./styles/Layout"
import TextStyle from "./styles/Text"
import { IFriendStatus } from "./types/types"

export default function Page() {
  const layout = useStyleSheet(LayoutStyle)

  const [userCode, setUserCode] = useState<string>("")
  const [isGeneratingCode, setIsGeneratingCode] = useState<boolean>(false)
  const [friendsCode, setFriendsCode] = useState<string>("")
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [friendsStatus, setFriendsStatus] = useState<IFriendStatus[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  /**
   * Get the user's code if existing
   */
  useEffect(() => {
    const fetchUserCode = async () => {
      await getUser().then(async user => {
        if (user !== null) {
          setIsLoggedIn(true)
          const savedCode = await getUserCode()

          if (savedCode !== null) {
            setUserCode(savedCode)
            setIsLoaded(true)
            return
          }

          try {
            const userQuery = query(
              collection(database, "user"),
              where("userID", "==", user),
              limit(1),
            )

            const querySnapshot = await getDocs(userQuery)

            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0]
              const userCode = userDoc.data().code

              // Set the mood data
              setUserCode(userCode)
              setIsLoaded(true)
            }
          } catch (error: any) {
            showToastError("Error fetching your user code.")
          }
        } else {
          setIsLoaded(true)
        }
      })
    }

    const handleFetchFriendsStatus = async () => {
      const user = await getUser()
      if (user === null) {
        setIsLoaded(true)
        return
      }

      // Get all user codes shared to this user
      const userQuery = query(
        collection(database, "shared-codes"),
        where("userID", "==", user),
      )

      const userCodesSnapshot = await getDocs(userQuery)
      if (userCodesSnapshot.empty) return

      // Update all friends status
      for (const doc of userCodesSnapshot.docs) {
        getFriendStatusMood(
          doc.data().friendID,
          doc.data().code,
          doc.data().friendName,
        )
      }
    }

    if (!isLoaded) {
      fetchUserCode()
      handleFetchFriendsStatus()
    }
  }, [isLoaded])

  /**
   * Generate a unique code for the user to share with friends
   */
  const handleGenerateCode = async () => {
    setIsGeneratingCode(true)
    try {
      const user = await getUser()

      if (!user) {
        return
      }

      // Get user data
      const userQuery = query(
        collection(database, "user"),
        where("userID", "==", user),
      )
      const querySnapshot = await getDocs(userQuery)
      const userDoc = querySnapshot.docs[0]

      // Generate code based on name
      const code = generateUniqueCode(userDoc.data().name)

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]

        try {
          await updateDoc(userDoc.ref, { code: code })
          saveUserCode(code)
          setUserCode(code)
          setIsGeneratingCode(false)
        } catch (error) {
          showToastError("Error generating code")
          setIsGeneratingCode(false)
        }
      }
    } catch (error) {
      showToastError("Error generating code")
      setIsGeneratingCode(false)
    }
  }

  /**
   * Add a friend's code to the database
   */
  const handleFriendCode = async () => {
    if (friendsCode === "") {
      showToastError("Please enter a code.")
      return
    }

    if (friendsCode === userCode) {
      showToastError("You cannot add yourself.")
      return
    }

    // Check if the code is already added
    const existingFriend = friendsStatus.find(
      friendStatus => friendStatus.friendCode === friendsCode,
    )

    if (existingFriend) {
      showToastError("You have already added this friend.")
      return
    }

    setIsSaving(true)

    await getUser().then(async user => {

      // Add the friend's code to the shared-codes collection
      await addDoc(collection(database, "shared-codes"), {
        userID: user,
        dateCreated: Timestamp.now(),
        code: friendsCode.toUpperCase(),
      }).then(async friendDocId => {
        // Get the matched user by code
        const userQuery = query(
          collection(database, "user"),
          where("code", "==", friendsCode.toUpperCase()),
        )

        const querySnapshot = await getDocs(userQuery)

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0]

          // Update friend ref
          await updateDoc(friendDocId, {
            friendName: userDoc.data().name,
            friendID: userDoc.data().userID,
          })

          // Update the friends status
          getFriendStatusMood(
            userDoc.data().userID,
            friendsCode,
            userDoc.data().name,
          )
          setIsSaving(false)
          setFriendsCode("")
        } else {
          showToastError("No user found with that code.")
          setIsSaving(false)
        }
      })
    })
  }

  /**
   * Remove a friend's code from the shared-codes collection
   * @param friendCode
   */
  const removeFriendCode = async (friendCode: string) => {
    // Delete from shared-codes
    const userQuery = query(
      collection(database, "shared-codes"),
      where("code", "==", friendCode),
      where("userID", "==", await getUser()),
      limit(1),
    )

    const userQuerySnapshot = await getDocs(userQuery)
    userQuerySnapshot.forEach(doc => {
      deleteDoc(doc.ref)
    })

    // Create a new array excluding the friend with the specified friendCode
    const updatedFriendsStatus = friendsStatus.filter(
      friendStatus => friendStatus.friendCode !== friendCode,
    )

    // Update the state with the new array
    setFriendsStatus(updatedFriendsStatus)
  }

  /**
   * Add friends mood and status
   * @param friendID
   * @param friendCode
   * @param friendName
   * @returns
   */
  const getFriendStatusMood = async (
    friendID: string,
    friendCode: string,
    friendName: string,
  ) => {
    const moodQuery = query(
      collection(database, "mood"),
      where("userID", "==", friendID),
      orderBy("dateCreated", "desc"),
      limit(1),
    )

    const moodSnapshot = await getDocs(moodQuery)

    let mood = "neutral"
    if (!moodSnapshot.empty) {
      const moodDoc = moodSnapshot.docs[0]
      mood = moodDoc.data().mood
    }

    const statusQuery = query(
      collection(database, "status"),
      where("userID", "==", friendID),
      orderBy("dateCreated", "desc"),
      limit(1),
    )

    const statusSnapshot = await getDocs(statusQuery)
    if (statusSnapshot.empty) return

    const statusDoc = statusSnapshot.docs[0]
    const { status: statusData, dateCreated } = statusDoc.data()

    let currentStatus = statusData
    if (isMoreThanOneHourOld(dateCreated)) {
      currentStatus = decreaseValuesBasedOnTime(dateCreated, currentStatus)
    }

    setFriendsStatus(prev => [
      ...prev,
      {
        status: {
          hunger: currentStatus.hunger,
          thirst: currentStatus.thirst,
          energy: currentStatus.energy,
          hygiene: currentStatus.hygiene,
          social: currentStatus.social,
          fun: currentStatus.fun,
        },
        friendCode: friendCode,
        name: friendName,
        dateCreated: showAsDateTime(dateCreated.seconds),
        mood: mood,
      },
    ])
  }

  return (
    <>
      <KeyboardAwareScrollView style={{ backgroundColor: "#94CBFF" }}>
        <ScrollView>
          {!isLoggedIn ? (
            <Layout style={[layout.basic]}>
              <Layout style={layout.colCenter}>
                <Text style={[TextStyle.pageTitle]} category="h2">
                  Sign up to share your Moodlets with friends!
                </Text>
                <Link href="/signup" asChild>
                  <Button
                    status="danger"
                    size={"giant"}
                    accessoryLeft={<Icon name="log-in-outline" />}>
                    Sign up
                  </Button>
                </Link>
              </Layout>
            </Layout>
          ) : (
            <>
              <Layout style={[layout.basic]}>
                {!isLoaded && <Loading />}
                {!userCode ? (
                  <>
                    <Text style={[TextStyle.pageTitle]} category="h1">
                      Get Code to Share Moodlets
                    </Text>
                    <Button
                      onPress={handleGenerateCode}
                      disabled={isGeneratingCode}>
                      {isGeneratingCode ? <Loading /> : "Generate Code"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Text style={[TextStyle.pageTitle]} category="h1">
                      Your Code
                    </Text>
                    <Text
                      selectable={true}
                      style={[TextStyle.subtitle, TextStyle.bold]}
                      category="h2">
                      {userCode}
                    </Text>
                    <Text style={[TextStyle.subtitle]} category="h5">
                      Share your Moodlets with friends!
                    </Text>
                  </>
                )}
              </Layout>

              <Divider />

              <Layout style={[layout.basic]}>
                <Text style={[TextStyle.title, TextStyle.bold]} category="h1">
                  Friend's Moodlets
                </Text>

                <Text style={[TextStyle.subtitle]} category="h4">
                  See how your friends are doing!
                </Text>

                <Layout style={{ marginVertical: 25 }}>
                  {friendsStatus &&
                    friendsStatus.map((friendStatus, index) => {
                      return (
                        <FriendStatus
                          key={index}
                          friendStatus={friendStatus}
                          removeFriendCode={removeFriendCode}
                        />
                      )
                    })}
                </Layout>

                <AddFriend
                  friendsCode={friendsCode}
                  setFriendsCode={setFriendsCode}
                  isSaving={isSaving}
                  handleFriendCode={handleFriendCode}
                />
              </Layout>
            </>
          )}
        </ScrollView>
      </KeyboardAwareScrollView>
      <BottomTabNavigation currentSelected={2} />
    </>
  )
}
