import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card, Icon, LoadingModal, Screen, Text } from "app/components"
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
  receiver_id: string
  created_at: string
  album: {
    id: string
    album_name: string
  }
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
          id,
    receiver_id,
    viewed,
    type,
    title,
    content,
    created_at,
    album (
      id,
      album_name
    )
  `,
        )
        .eq("receiver_id", userId)
      if (error) {
        console.log("Error fetching notification data:", error)
        return
      }
      console.log("Fetched notification data!")
      setNotifications(data)
    }

    async function handleViewNotification(notificationId: string) {
      const { data, error } = await supabase
        .from("notification")
        .update({ viewed: true })
        .eq("id", notificationId)
      if (error) {
        console.log("Error updating notification data:", error)
        return
      }
      console.log("Updated notification data!")
      setNotifications((prev) =>
        prev.map((prevNotification) =>
          prevNotification.id === notificationId
            ? { ...prevNotification, viewed: true }
            : prevNotification,
        ),
      )
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
          notifications.forEach((notification) => {
            if (!notification.viewed) {
              handleViewNotification(notification.id)
            }
          })
        },
      },
      [],
    )

    return (
      <Screen style={$root} preset="scroll">
        <LoadingModal duration={500} />
        {notifications.map((notification, index) => (
          <TouchableOpacity
            key={notification.id}
            onPress={() => {
              handleViewNotification(notification.id)
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
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
              <Button
                style={$button}
                onPress={() => {
                  navigation.navigate("Album", {
                    albumId: notification.album.id,
                    albumName: notification.album.album_name,
                  })
                }}
              >
                <Icon icon="caretRight" />
              </Button>
            </View>

            <DemoDivider />
          </TouchableOpacity>
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
  marginHorizontal: 5,
  width: "85%",
}

const $badge: ViewStyle = {
  position: "absolute",
  borderRadius: 10,
  top: 5,
  right: "15%",
  padding: 4,
  backgroundColor: colors.palette.primary600,
}

const $button: ViewStyle = {
  width: "10%",
  marginHorizontal: 5,
}
