import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface AlbumScreenProps extends AppStackScreenProps<"Album"> {}

export const AlbumScreen: FC<AlbumScreenProps> = observer(function AlbumScreen(_props) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  console.log(_props.route.params.albumId)

  function goBack() {
    _props.navigation.goBack()
  }

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="album" />
      <Button text="Go back" onPress={goBack} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
