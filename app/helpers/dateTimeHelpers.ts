import {
  IDateCreated,
  IRate,
  IStatus,
  StatusType,
  TimeRate,
} from "@/types/types"

/**
 * Show Google Timestamp as a time string
 * @param givenSeconds
 * @returns
 */
const showAsTime = (givenSeconds: number) => {
  const date = new Date(givenSeconds * 1000)
  const hours = date.getHours()
  const minutes = "0" + date.getMinutes()
  const seconds = "0" + date.getSeconds()
  const formattedTime =
    hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2)

  return formattedTime
}

/**
 * Show Google Timestamp as a date and time string
 * @param givenSeconds
 * @returns
 */
const showAsDateTime = (givenSeconds: number) => {
  const date = new Date(givenSeconds * 1000)
  const year = date.getFullYear()
  const month = "0" + (date.getMonth() + 1) // Months are zero-indexed
  const day = "0" + date.getDate()
  const hours = "0" + date.getHours()
  const minutes = "0" + date.getMinutes()
  const seconds = "0" + date.getSeconds()

  // Format the date
  const formattedDate = year + "-" + month.substr(-2) + "-" + day.substr(-2)

  // Format the time
  const formattedTime =
    hours.substr(-2) + ":" + minutes.substr(-2) + ":" + seconds.substr(-2)

  return formattedDate + " " + formattedTime // Combine date and time
}

/**
 * Check if more than 1 hour has passed since the given date
 * @param dateCreated
 * @returns
 */
function isMoreThanOneHourOld(dateCreated: any) {
  // Extract seconds and nanoseconds from dateCreated
  const { seconds, nanoseconds } = dateCreated

  // Convert them to milliseconds: (seconds * 1000) + (nanoseconds / 1000000)
  const dateCreatedInMs = seconds * 1000 + nanoseconds / 1000000

  // Get the current date in milliseconds
  const currentDateInMs = Date.now()

  // Calculate the difference in milliseconds
  const differenceInMs = currentDateInMs - dateCreatedInMs

  // Check if the difference is more than 1 hour (3600000 milliseconds in 1 hour)
  return differenceInMs > 3600000
}

const decreaseRates: Record<string, IRate> = {
  hunger: { rate: 0.2, time: 1 },
  thirst: { rate: 0.25, time: 1 },
  energy: { rate: 0.08, time: 1 },
  hygiene: { rate: 0.07, time: 2 },
  social: { rate: 0.05, time: 2 },
  fun: { rate: 0.04, time: 2 },
}

/**
 * Calculates new status values by reducing each property based on defined rates and time.
 * @param dateCreated - The date the status was created.
 * @param status - The current status object.
 * @returns A new status object with decreased values.
 */
function decreaseValuesBasedOnTime(
  dateCreated: IDateCreated,
  status: IStatus,
): IStatus {
  const { seconds, nanoseconds } = dateCreated
  const dateCreatedInMs = seconds * 1000 + nanoseconds / 1000000
  const currentDateInMs = Date.now()

  const differenceInMs = currentDateInMs - dateCreatedInMs
  const differenceInHours = differenceInMs / 3600000 // Convert milliseconds to hours

  const newStatus: IStatus = {
    energy: 1,
    fun: 1,
    hunger: 1,
    hygiene: 1,
    social: 1,
    thirst: 1,
  }

  // Calculate new values by reducing each property based on defined rates and time
  for (const key in status) {
    const { rate, time } = decreaseRates[key]
    const effectiveHours = differenceInHours / time // Adjust hours for properties that decrease every X hours
    newStatus[key as keyof IStatus] =
      status[key as keyof IStatus] * Math.pow(1 - rate, effectiveHours) // Decrease by rate per effective hour
  }

  return newStatus
}

const notificationRates: Record<StatusType, TimeRate> = {
  hunger: { max: 6 * 60, mid: 3 * 60, low: 45 },
  thirst: { max: 2 * 60, mid: 60, low: 20 },
  hygiene: { max: 28 * 60, mid: 14 * 60, low: 5 * 60 },
  energy: { max: 18 * 60, mid: 10 * 60, low: 4 * 60 },
  social: { max: 72 * 60, mid: 42 * 60, low: 24 * 60 },
  fun: { max: 48 * 60, mid: 24 * 60, low: 12 * 60 },
}

/**
 * Computes the hour and minute for a notification based on the given status type and value.
 * @param statusType - The type of status (e.g. "mood", "energy") used to determine the notification delay.
 * @param value - The value associated with the status, used to determine the notification delay.
 * @returns An object containing the hour and minute for the notification.
 */
function computeNotificationTime(
  statusType: StatusType,
  value: number,
): { hour: number; minute: number } {
  const rates = notificationRates[statusType]
  let delayInMinutes: number

  if (value > 0.8) {
    delayInMinutes = rates.max
  } else if (value > 0.5) {
    delayInMinutes = rates.mid
  } else {
    delayInMinutes = rates.low
  }

  const targetDate = new Date(Date.now() + delayInMinutes * 60 * 1000)
  const hour = targetDate.getHours()
  const minute = targetDate.getMinutes()

  return { hour, minute }
}

/**
 * Determines if a given timestamp is from the previous date.
 * @param timestamp - The timestamp to check.
 * @returns True if the timestamp is from the previous date, false otherwise.
 */
function isFromPreviousDate(timestamp: IDateCreated): boolean {
  const givenDate = new Date(timestamp.seconds * 1000) // Convert to milliseconds

  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset to start of today

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1) // Set to start of yesterday

  return givenDate >= yesterday && givenDate < today
}

/**
 *
 * @param param0
 * @returns
 */
function getSecondsUntilNextTime(hour: number, minute = 0) {
  // Get the current date and time
  const now = new Date()

  // Create a new Date object for the next occurrence of the specified time
  let nextTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0,
  )

  // If the current time is past the specified time, set nextTime to that time the next day
  if (now.getTime() > nextTime.getTime()) {
    nextTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      hour,
      minute,
      0,
    )
  }

  // Calculate the number of seconds from now until the next specified time
  const secondsFromNow = (nextTime.getTime() - now.getTime()) / 1000

  return secondsFromNow
}

export {
  computeNotificationTime,
  decreaseValuesBasedOnTime,
  getSecondsUntilNextTime,
  isFromPreviousDate,
  isMoreThanOneHourOld,
  showAsDateTime,
  showAsTime,
}
