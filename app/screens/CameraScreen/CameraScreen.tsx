import React, { FC } from "react"
import { observer } from "mobx-react-lite"
// import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
// import { Screen } from "app/components"
import CameraView from "./CameraView"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface CameraScreenProps extends AppStackScreenProps<"Camera"> {}

export const CameraScreen: FC<CameraScreenProps> = observer(function CameraScreen(_props) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return <CameraView _props={_props}/>
})

// const $root: ViewStyle = {
//   flex: 1,
//   width: "100%",
//   height: "100%",
// }
