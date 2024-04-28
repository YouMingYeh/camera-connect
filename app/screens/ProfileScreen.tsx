import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Button, ViewStyle, View } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { supabase } from "../utils/supabase"
import { useStores } from "../models"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ProfileScreenProps extends AppStackScreenProps<"Profile"> { }

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const {
    authenticationStore: { setAuthToken },
  } = useStores()
  async function signout() {
    const { error } = await supabase.auth.signOut()
    if (error) return
    setAuthToken("")
  }
  return (
    <Screen style={$root} preset="scroll">
      <View>
        <Text text="profile" />
        <Button onPress={signout} title="登出"></Button>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
