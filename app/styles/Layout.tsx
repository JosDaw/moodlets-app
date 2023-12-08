import { StyleSheet } from "react-native"

const LayoutStyle = StyleSheet.create({
  basic: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 35,
    backgroundColor: "color-info-300",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "transparent",
  },
  rowEvenly: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    backgroundColor: "transparent",
    flexWrap: "wrap",
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    flexWrap: "wrap",
  },
  colCenter: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  colLeft: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: "transparent",
  },
})

export default LayoutStyle
