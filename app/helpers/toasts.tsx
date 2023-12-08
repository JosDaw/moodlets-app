import Toast from "react-native-root-toast"

const showToastError = (errorMessage: string) => {
  Toast.show(`Oh no! ${errorMessage}`, {
    duration: Toast.durations.LONG,
    animation: true,
    shadow: true,
    hideOnPress: true,
    delay: 0,
    textColor: "#FFFFFF",
    backgroundColor: "#FF3D71",
  })
}

const showToastSuccess = (successMessage: string) => {
  Toast.show(`🎉 ${successMessage}`, {
    duration: Toast.durations.SHORT,
    animation: true,
    shadow: true,
    hideOnPress: true,
    delay: 0,
    textColor: "#FFFFFF",
    backgroundColor: "#00B383",
  })
}

export { showToastError, showToastSuccess }
