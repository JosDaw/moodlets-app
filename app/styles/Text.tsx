import { StyleSheet } from "react-native"

const TextStyle = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginVertical: 2,
    fontFamily: "Raleway_400Regular",
  },
  pageTitle: {
    marginVertical: 50,
    fontFamily: "Raleway_700Bold",
    textAlign: "center",
    fontSize: 45,
  },
  title: {
    marginVertical: 10,
    fontFamily: "Raleway_400Regular",
    textAlign: "center",
  },
  subtitle: {
    marginVertical: 5,
    fontFamily: "Raleway_400Regular",
    textAlign: "center",
  },
  bold: {
    fontFamily: "Raleway_700Bold",
  },
})

export default TextStyle
