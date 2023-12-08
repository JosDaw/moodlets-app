import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import Constants from "expo-constants"
import { getApp, getApps, initializeApp } from "firebase/app"
import { getReactNativePersistence, initializeAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Initialize Firebase
const firebaseConfig = {
  apiKey: Constants?.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_APIKEY,
  authDomain: Constants?.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: Constants?.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_PROJECTID,
  storageBucket:
    Constants?.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId:
    Constants?.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: Constants?.expoConfig?.extra?.EXPO_PUBLIC_FIREBASE_APPID,
}

let app
let auth: any

// Check if there are no firebase apps initialized. If none, initialize our app.
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  })
} else {
  app = getApp() // if already initialized, use that one
}

export { app, auth }
export const database = getFirestore(app)
export const storage = getStorage(app)
