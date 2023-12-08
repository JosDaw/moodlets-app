import { IStatus } from "@/types/types"
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import emotions from "../assets/emotions.json"
import originalStatus from "../assets/status.json"
import { database } from "../config/firebase"
import {
  decreaseValuesBasedOnTime,
  isMoreThanOneHourOld,
} from "./dateTimeHelpers"
import { showToastError } from "./toasts"
import { getStatus, getUser } from "./userHelper"

/**
 * Get the lowest status key from the status object
 * @param statusObj
 * @returns
 */
const getLowestStatusKey = (statusObj: IStatus): keyof IStatus | "" => {
  const lowestKey = Object.entries(statusObj).reduce(
    (lowestKey, [currentKey, currentValue]) => {
      if (currentValue < statusObj[lowestKey as keyof IStatus]) {
        return currentKey as keyof IStatus
      } else {
        return lowestKey
      }
    },
    "hunger" as keyof IStatus,
  ) // Initial value set to 'hunger' for comparison

  return statusObj[lowestKey] < 0.5 ? lowestKey : ""
}

/**
 * Return a recommendation based on the status
 * @param status
 * @returns
 */
function statusRecommendation(
  status: "hunger" | "thirst" | "hygiene" | "energy" | "social" | "fun",
): string {
  const messages: { [key: string]: string[] } = {
    hunger: [
      "Feeling a bit hungry? You should get something to eat! \n\nEating regularly is important for your health.",
      "Hunger kicking in? Time for a snack or a meal to keep your energy up! \n\nRegular meals help maintain good health and mood.",
      "Stomach rumbling? A balanced meal could be just what you need right now. \n\nNutritious food fuels your body and mind.",
      "Need a bite? Opt for something healthy to nourish your body. \n\nEating well is essential for maintaining energy levels.",
    ],
    thirst: [
      "Don't forget to drink lots of water! \n\nWater can help you stay hydrated and keep your skin healthy. Low hydration can also cause headaches and fatigue.",
      "Feeling thirsty? Keep a water bottle handy and stay hydrated! \n\nProper hydration is key to maintaining overall health.",
      "Need a sip? Regular water intake is crucial for health and well-being. \n\nStaying hydrated helps with focus and energy.",
      "Quench your thirst with some water. It's essential for your body's daily functions. \n\nHydration impacts mood and concentration.",
    ],
    hygiene: [
      "Feeling a bit grubby? Try having a little wash or trying some clean clothes. \n\nGetting clean can help you feel refreshed and ready to take on the day.",
      "Time to freshen up? A quick shower or change of clothes can do wonders! \n\nMaintaining good hygiene boosts confidence and health.",
      "A bit unkempt? A shower and fresh attire can lift your spirits. \n\nPersonal hygiene is key to feeling good about yourself.",
      "Need to rejuvenate? Consider a relaxing bath or a grooming session. \n\nGood hygiene practices can enhance your mood and health.",
    ],
    energy: [
      "Your energy levels are getting pretty low! Try getting some rest or having something to eat and drink to feel more energized. \n\nGetting enough sleep is important for your health and can help you feel more motivated for the day ahead.",
      "Running on low? Consider a short nap or a healthy snack to boost your energy levels. \n\nBalancing rest and nutrition is crucial for staying energized.",
      "Feeling sluggish? A quick break or a walk might just be what you need. \n\nRegular physical activity can boost your energy and mood.",
      "Lacking energy? Assess your sleep schedule and diet for improvements. \n\nAdequate rest and nutrition are vital for sustained energy.",
    ],
    social: [
      "Have a yearning to meet some friends? Try calling someone you know or joining a club. \n\nSocialising is important for your mental health and can help you feel more connected to others.",
      "Feeling isolated? Reach out to a friend or family member, or consider meeting new people. \n\nSocial connections are vital for emotional well-being.",
      "Need human interaction? Organize a meet-up or participate in a community event. \n\nEngaging with others can uplift your spirits.",
      "Looking for company? A quick call or message to a friend can brighten your day. \n\nRegular social contact is essential for mental health.",
    ],
    fun: [
      "Getting restless or bored? Try doing something you enjoy! \n\nHaving fun is important for your mental health and can help you feel more positive.",
      "Looking for a mood boost? Engage in a hobby or activity you love! \n\nRecreational activities can greatly enhance your mood and well-being.",
      "Bored? Dive into a new book, watch a movie, or explore a hobby. \n\nEnjoyable activities are crucial for relaxation and happiness.",
      "Need some excitement? Try something new or revisit an old favorite pastime. \n\nVariety in leisure activities can keep life interesting and joyful.",
    ],
  }

  // Get random message for the status
  const statusMessages = messages[status] || messages["fun"]
  return statusMessages[Math.floor(Math.random() * statusMessages.length)]
}

/**
 * Use the right word to describe the status
 * @param status
 * @returns
 */
function statusFeeling(status: string): string {
  switch (status) {
    case "hunger":
      return "hungry"

    case "thirst":
      return "thirsty"

    case "hygiene":
      return "dirty"

    case "energy":
      return "tired"

    case "social":
      return "lonely"

    case "fun":
      return "bored"

    default:
      return "bored"
  }
}

/**
 * Return a color from red to green based on overall status score
 * @param data
 * @returns
 */
function calculateColorIndexStatus(data: IStatus): string {
  // Calculate the overall score as the average of all values
  const values = Object.values(data)
  const overallScore = values.reduce((acc, val) => acc + val, 0) / values.length

  // Map the overall score to a color gradient from red to green
  const hue = overallScore * 120 // Map 0-1 to 0-120 (Hue values for red to green)
  const color = `hsl(${hue}, 100%, 50%)`

  return color
}

function calculateStatusColorFromNumber(value: number) {
  const red = (1 - value) * 255
  const green = value * 255
  return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`
}

/**
 * Calculates the color index for a given mood.
 * @param mood The mood to calculate the color index for.
 * @returns The color index for the given mood, or "#FFAA00" if the mood is not found.
 */
function calculateColorIndexMood(mood: string): string {
  const found = emotions.find(item => item.text === mood)
  return found ? found.color : "#FFAA00"
}

async function fetchStatusData(
  setStatus: React.Dispatch<React.SetStateAction<IStatus>>,
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const user = await getUser()
  try {
    const storedStatus = await getStatus()

    // Use existing status if available
    if (storedStatus) {
      let currentStatus = storedStatus.status
      // Update status if it's more than an hour old
      if (isMoreThanOneHourOld(storedStatus.dateCreated)) {
        currentStatus = decreaseValuesBasedOnTime(
          storedStatus.dateCreated,
          storedStatus.statusData,
        )
      }

      setStatus(currentStatus)
      setIsLoaded(true)
    } else {
      const statusQuery = query(
        collection(database, "status"),
        where("userID", "==", user),
        orderBy("dateCreated", "desc"),
        limit(1),
      )

      const querySnapshot = await getDocs(statusQuery)

      // If no status, set to default
      if (querySnapshot.empty) {
        setStatus(originalStatus)
        setIsLoaded(true)
        return
      }

      const statusDoc = querySnapshot.docs[0]
      const { status: statusData, dateCreated } = statusDoc.data()

      let currentStatus = statusData

      // Update status if it's more than an hour old
      if (isMoreThanOneHourOld(dateCreated)) {
        currentStatus = decreaseValuesBasedOnTime(dateCreated, statusData)
      }

      setStatus(currentStatus)
    }

    setIsLoaded(true)
  } catch (error: any) {
    showToastError("Error fetching status data: " + error.message)
  }
}

export {
  calculateColorIndexMood,
  calculateColorIndexStatus,
  calculateStatusColorFromNumber,
  fetchStatusData,
  getLowestStatusKey,
  statusFeeling,
  statusRecommendation,
}
