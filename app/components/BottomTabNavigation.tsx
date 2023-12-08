import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  IconElement,
} from "@ui-kitten/components"
import { router } from "expo-router"
import React, { useState } from "react"

interface BottomTabNavigationProps {
  currentSelected: number
}

const UpdateIcon = (props: any): IconElement => (
  <Icon {...props} name="edit-2-outline" />
)

const MoodIcon = (props: any): IconElement => (
  <Icon {...props} name="smiling-face-outline" />
)

const ChartIcon = (props: any): IconElement => (
  <Icon {...props} name="activity-outline" />
)

const FriendsIcon = (props: any): IconElement => (
  <Icon {...props} name="people-outline" />
)

export const BottomTabNavigation = ({
  currentSelected,
}: BottomTabNavigationProps): React.ReactElement => {
  const [selectedIndex, setSelectedIndex] = useState<number>(currentSelected)

  return (
    <BottomNavigation
      selectedIndex={selectedIndex}
      onSelect={index => {
        setSelectedIndex(index)
        if (index === 0) router.push("/moodlet")
        if (index === 1) router.push("/profile")
        if (index === 2) router.push("/share")
      }}
      style={{ backgroundColor: "#94CBFF" }}>
      <BottomNavigationTab title="UPDATE" icon={UpdateIcon} />
      <BottomNavigationTab title="MOODLETS" icon={MoodIcon} />
      <BottomNavigationTab title="FRIENDS" icon={FriendsIcon} />
    </BottomNavigation>
  )
}
