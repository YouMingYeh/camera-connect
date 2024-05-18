import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, StyleSheet } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import SuggestionCarousel from "./SuggestionCarousel"
import FavoriteCarousel from "./FavoriteCarousel"

interface ExploreScreenProps extends AppStackScreenProps<"Explore"> {}

export const ExploreScreen: FC<ExploreScreenProps> = observer(function ExploreScreen() {
  return (
    <Screen style={$root} preset="scroll">
      <Text text="Suggestion" style={styles.name} />
      <SuggestionCarousel />
      <Text text="My Favorite" style={styles.name} />
      <FavoriteCarousel />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  marginTop: 32,
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "800",
    margin: 16,
    padding: 8,
  },
})
