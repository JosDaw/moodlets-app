import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Layout, Text } from "@ui-kitten/components"
import React from "react"
import { FlatList, StyleSheet } from "react-native"
import { calculateColorIndexMood } from "../helpers/statusHelpers"
import TextStyle from "../styles/Text"

interface MoodChartProps {
  allMoodData: IMoodChartItem[]
}

const MoodChart = ({ allMoodData }: MoodChartProps) => {
  // Extract unique dates for the header
  const uniqueDates = [...new Set(allMoodData?.map(item => item.date))]

  return (
    <FlatList
      style={{ marginVertical: 20 }}
      data={uniqueDates}
      keyExtractor={item => item.toString()}
      horizontal={false}
      numColumns={5}
      renderItem={({ item: date }) => {
        const moodForDate =
          allMoodData?.find(d => d.date === date)?.mood || "neutral"
        return (
          <Layout
            style={[
              styles.cell,
              {
                backgroundColor: calculateColorIndexMood(String(moodForDate)),
              },
            ]}>
            <MaterialCommunityIcons
              name={`emoticon-${moodForDate}` as any}
              size={25}
              color={"#fff"}
            />
            <Text style={TextStyle.text}>
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </Layout>
        )
      }}
    />
  )
}

export default MoodChart

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
  },

  cell: {
    justifyContent: "center",
    alignItems: "center",
    width: 55,
    height: 55,
  },
})
