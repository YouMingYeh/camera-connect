import * as React from "react"
import { Image, ImageStyle, Modal, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { Loading } from "./Loading"
import { AutoImage } from "./AutoImage"

export interface LoadingModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  duration?: number
}

/**
 * Describe your component here
 */
export const LoadingModal = observer(function LoadingModal(props: LoadingModalProps) {
  const { style, duration } = props
  const $styles = [$container, style]
  const [modalVisible, setModalVisible] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setModalVisible(false)
    }, duration || 2000)
  }, [])

  return (
    <>
      {modalVisible && (
        <Modal style={$modalContent} visible={true}>
          <View style={$container}>
            <Image
              style={$image}
              source={require("../../assets/images/logo.png")}
              resizeMode="contain"
            />

            <Text
              style={[
                $text,
                {
                  marginTop: 40,
                  fontSize: 24,
                  padding: 10,
                },
              ]}
            >
              你知道嗎？
            </Text>
            <Text style={$text}>
              {randomTextForLoading[Math.floor(Math.random() * randomTextForLoading.length)]}
            </Text>
            <Loading />
          </View>
        </Modal>
      )}
    </>
  )
})

const randomTextForLoading = [
  "你每次進入相簿時都會馬上顯示最新的相片，你可以透過右滑來表示喜歡！",
  "你可以在相簿頁面中創建你與朋友的相簿",
  "你可以在探索頁面中搜尋你的相片",
  "你可以在個人資料頁面中透過 QR Code 加朋友、邀請朋友、邀請他人加入相簿",
  "你可以在通知頁面中看到你的好友的動態",
  "你可以在個人資料頁面中更改你的名稱、頭像",
  "相機可以錄影、自拍、閃光，並在拍攝後編輯相片和影片上傳至相簿",
]

const $container: ViewStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  padding: 40,
}

const $modalContent: ViewStyle = {}

const $image: ImageStyle = {
  height: 100,
}

const $text: TextStyle = {
  textAlign: "center",
}
