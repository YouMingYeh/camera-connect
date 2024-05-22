import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Card, Screen, Text } from "app/components"
import { getUserId, supabase } from "app/utils/supabase"
import { DemoUseCase } from "./DemoShowroomScreen/DemoUseCase"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface NotificationsScreenProps extends AppStackScreenProps<"Notifications"> {}

interface Notification {
  title: string
  content: string
}

export const NotificationsScreen: FC<NotificationsScreenProps> = observer(
  function NotificationsScreen() {
    const [notifications, setNotifications] = useState<Array<Notification>>([])
    async function pullNotifications() {
      const userId = await getUserId()
      if (userId === null) {
        return
      }
      const { data, error } = await supabase
        .from("notification")
        .select(
          `
    receiver_id,
    viewed,
    type,
    title,
    content,
    created_at
  `,
        )
        .eq("receiver_id", userId)
      if (error) {
        return
      }
      console.log("Fetched notification data!")
      console.log(data)
      setNotifications(data)
    }

    useEffect(() => {
      pullNotifications()
    }, [])
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={$root} preset="scroll">
        <Text text="notifications" />
        {notifications.map((notification, index) => (
          <>
            <Card heading={notification.title} content={notification.content} />
            <DemoDivider />
          </>
        ))}
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
