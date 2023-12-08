import React from "react"
import { Dimensions, ScrollView } from "react-native"
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "victory-native"
import statusColors from "../assets/statusColors.json"

interface StatusLinechartProps {
  data: IStatusChartItem[]
  activeLine: string | null
}

const StatusLinechart = ({ data, activeLine }: StatusLinechartProps) => {
  const parsedData = data.map(item => ({
    date: new Date(item.date).getTime(),
    ...item.status,
  }))

  return (
    <ScrollView horizontal>
      <VictoryChart
        domain={{ y: [-0.1, 1.1] }}
        height={250}
        theme={VictoryTheme.material}
        width={Dimensions.get("window").width * 2}>
        <VictoryAxis
          dependentAxis
          tickValues={[0, 1]}
          tickFormat={[(tick: number) => (tick === 1 ? "😀" : "😢")]}
          label="😢 /\/\/\/\ 😀"
        />

        <VictoryAxis tickFormat={x => new Date(x).toLocaleDateString()} />

        {Object.keys(statusColors).map(statusKey => {
          if (activeLine === null || activeLine === statusKey) {
            return (
              <VictoryLine
                key={statusKey}
                data={parsedData}
                x="date"
                y={statusKey}
                interpolation="basis"
                style={{
                  data: {
                    stroke:
                      statusColors[statusKey as keyof typeof statusColors],
                  },
                }}
              />
            )
          }
          return null
        })}
      </VictoryChart>
    </ScrollView>
  )
}

export default StatusLinechart
