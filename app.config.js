export default ({ config }) => {
  return {
    ...config,
    expo: {
      version: "1.1.20",
      name: "moodlets",
      scheme: "moodlets",
      slug: "moodlet",
      icon: "./assets/icon.png",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#94CBFF",
      },
      ios: {
        buildNumber: "20",
        supportsTablet: true,
        bundleIdentifier: "com.moodlet",
      },
      android: {
        versionCode: 20,
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#94CBFF",
        },
        googleServicesFile: "./google-services.json",
        package: "com.moodlet",
      },
      extra: {
        eas: {
          projectId: "95c8fa3a-fd52-4b9c-8e5d-66021db7a233",
        },
        EXPO_PUBLIC_FIREBASE_APIKEY: process.env.EXPO_PUBLIC_FIREBASE_APIKEY,
        EXPO_PUBLIC_FIREBASE_AUTHDOMAIN:
          process.env.EXPO_PUBLIC_FIREBASE_AUTHDOMAIN,
        EXPO_PUBLIC_FIREBASE_DATABASEURL:
          process.env.EXPO_PUBLIC_FIREBASE_DATABASEURL,
        EXPO_PUBLIC_FIREBASE_PROJECTID:
          process.env.EXPO_PUBLIC_FIREBASE_PROJECTID,
        EXPO_PUBLIC_FIREBASE_STORAGEBUCKET:
          process.env.EXPO_PUBLIC_FIREBASE_STORAGEBUCKET,
        EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID:
          process.env.EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID,
        EXPO_PUBLIC_FIREBASE_APPID: process.env.EXPO_PUBLIC_FIREBASE_APPID,
        EXPO_PUBLIC_FIREBASE_APIKEY_CURRENT_KEY:
          process.env.EXPO_PUBLIC_FIREBASE_APIKEY_CURRENT_KEY,
        EXPO_PUBLIC_SENTRY: process.env.EXPO_PUBLIC_SENTRY,
        EXPO_PUBLIC_SENTRY_AUTH_TOKEN:
          process.env.EXPO_PUBLIC_SENTRY_AUTH_TOKEN,
      },
      updates: {
        url: "https://u.expo.dev/95c8fa3a-fd52-4b9c-8e5d-66021db7a233",
      },
      runtimeVersion: {
        policy: "appVersion",
      },
    },
    extra: {
      EXPO_PUBLIC_FIREBASE_APIKEY: process.env.EXPO_PUBLIC_FIREBASE_APIKEY,
      EXPO_PUBLIC_FIREBASE_AUTHDOMAIN:
        process.env.EXPO_PUBLIC_FIREBASE_AUTHDOMAIN,
      EXPO_PUBLIC_FIREBASE_DATABASEURL:
        process.env.EXPO_PUBLIC_FIREBASE_DATABASEURL,
      EXPO_PUBLIC_FIREBASE_PROJECTID:
        process.env.EXPO_PUBLIC_FIREBASE_PROJECTID,
      EXPO_PUBLIC_FIREBASE_STORAGEBUCKET:
        process.env.EXPO_PUBLIC_FIREBASE_STORAGEBUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID,
      EXPO_PUBLIC_FIREBASE_APPID: process.env.EXPO_PUBLIC_FIREBASE_APPID,
      EXPO_PUBLIC_FIREBASE_APIKEY_CURRENT_KEY:
        process.env.EXPO_PUBLIC_FIREBASE_APIKEY_CURRENT_KEY,
      EXPO_PUBLIC_SENTRY: process.env.EXPO_PUBLIC_SENTRY,
      EXPO_PUBLIC_SENTRY_AUTH_TOKEN: process.env.EXPO_PUBLIC_SENTRY_AUTH_TOKEN,
    },
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: "c9680dfd99aa",
            project: "moodlets-app",
            authToken: process.env.EXPO_PUBLIC_SENTRY_AUTH_TOKEN,
          },
        },
      ],
    },
  }
}
