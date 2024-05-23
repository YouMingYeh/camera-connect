import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Card, LoadingModal, Screen, Text } from "app/components"
import { getUserId, supabase } from "app/utils/supabase"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"
import { useHeader } from "app/utils/useHeader"
import { colors } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface NotificationsScreenProps extends AppStackScreenProps<"Notifications"> {}

interface Notification {
  id: string
  title: string
  content: string
  viewed: boolean
  type: string
}

export const NotificationsScreen: FC<NotificationsScreenProps> = observer(
  function NotificationsScreen(_props) {
    const { navigation } = _props
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

    useHeader(
      {
        title: "通知",
        leftIcon: "caretLeft",
        titleStyle: { fontSize: 24, padding: 10 },
        onLeftPress: () => navigation.navigate("Welcome"),
        rightText: "全部標示已讀",
        onRightPress: () => {
          setNotifications((prev) =>
            prev.map((notification) => ({ ...notification, viewed: true })),
          )
        },
      },
      [],
    )

    return (
      <Screen style={$root} preset="scroll">
        <LoadingModal />
        {notifications.map((notification, index) => (
          <>
            <TouchableOpacity
              key={notification.id}
              onPress={() => {
                setNotifications((prev) => {
                  const newNotifications = [...prev]
                  newNotifications[index].viewed = true
                  return newNotifications
                })
              }}
            >
              <View>
                <Card
                  style={[
                    $card,
                    {
                      backgroundColor: notification.viewed ? "white" : colors.palette.primary100,
                    },
                  ]}
                  heading={notification.title}
                  content={notification.content}
                />
                <View style={$badge}>
                  <Text style={{ color: "white", fontWeight: "bold" }}>{notification.type}</Text>
                </View>
              </View>
              <DemoDivider />
            </TouchableOpacity>
          </>
        ))}
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $card: ViewStyle = {
  padding: 10,
  marginHorizontal: 10,
}

const $badge: ViewStyle = {
  position: "absolute",
  borderRadius: 10,
  top: 10,
  right: 20,
  padding: 4,
  backgroundColor: colors.palette.primary600,
}
