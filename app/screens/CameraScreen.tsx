import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import {
  CameraDevice,
  useCameraDevice,
  useCameraDevices,
  useCameraPermission,
} from "react-native-vision-camera"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface CameraScreenProps extends AppStackScreenProps<"Camera"> {}

export const CameraScreen: FC<CameraScreenProps> = observer(function CameraScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const [device, setDevice] = useState<CameraDevice | null>(null)
  const cameraDevice = useCameraDevice("back")
  const { hasPermission, requestPermission } = useCameraPermission()

  useEffect(() => {
    if (!device && cameraDevice) {
      setDevice(cameraDevice)
    }

    if (!hasPermission) {
      requestPermission()
    }
  }, [])
  if (!device || !hasPermission) {
    return (
      <Screen style={$root} preset="scroll">
        <Text text="no device or permission" />
      </Screen>
    )
  }

  return (
    <Screen style={$root} preset="scroll">
      <Text text="camera" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
