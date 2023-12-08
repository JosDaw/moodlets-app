import { Layout, ProgressBar } from "@ui-kitten/components"
import React from "react"

interface BarStatusProps {
  progress: number
  barSize?: number
}

export const BarStatus = ({
  progress,
  barSize = 120,
}: BarStatusProps): React.ReactElement => {
  return (
    <Layout
      style={{
        backgroundColor: "#ffff",
        borderRadius: 100,
        padding: 1,
        marginTop: 5,
      }}>
      <ProgressBar
        progress={progress}
        style={{ width: barSize, height: 5 }}
        status={
          progress > 0.75 ? "success" : progress < 0.5 ? "danger" : "warning"
        }
      />
    </Layout>
  )
}
