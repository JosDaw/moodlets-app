export interface IStatus {
  hunger: number
  thirst: number
  energy: number
  hygiene: number
  social: number
  fun: number
}

export interface IFriendStatus {
  name: string
  status: IStatus
  dateCreated: string
  friendCode: string
  mood: string
}

export interface IDateCreated {
  nanoseconds: number
  seconds: number
}

export interface IRate {
  rate: number
  time: number
}

export type StatusType =
  | "hunger"
  | "thirst"
  | "hygiene"
  | "energy"
  | "social"
  | "fun"
export type TimeRate = { max: number; mid: number; low: number }

export interface ISignup {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export interface ILogin {
  email: string
  password: string
}

export interface ReminderState {
  daily: boolean
  hunger: boolean
  thirst: boolean
  energy: boolean
  hygiene: boolean
  social: boolean
  fun: boolean
}

export interface IMoodChartItem {
  date: Date
  mood: number
}

export interface IStatusChartItem {
  date: string
  status: IStatus
}

export interface IFirebaseStatus {
  status: IStatus
  dateCreated: IDateCreated
}
