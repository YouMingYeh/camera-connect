import * as React from "react"
import { Modal, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { Loading } from "./Loading"

export interface LoadingModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const LoadingModal = observer(function LoadingModal(props: LoadingModalProps) {
  const { style } = props
  const $styles = [$container, style]
  const [modalVisible, setModalVisible] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setModalVisible(false)
    }, 1500)
  }, [])

  return (
    < >
      {modalVisible && (
        <Modal style={$modalContent} visible={true} >
          <View style={$container}>
          <Loading />
          </View>
        </Modal>
      )}
    </>
  )
})

const $container: ViewStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
}

const $modalContent: ViewStyle = {
}
