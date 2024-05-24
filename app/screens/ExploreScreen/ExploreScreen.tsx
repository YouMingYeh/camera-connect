import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, StyleSheet, TextInput, Text } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import SuggestionCarousel from "./SuggestionCarousel"
import FavoriteCarousel from "./FavoriteCarousel"
import Search from "./Search"
import { getUserId } from "../../utils/supabase"
interface ExploreScreenProps extends AppStackScreenProps<"Explore"> {}

export const ExploreScreen: FC<ExploreScreenProps> = observer(function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [userID, setUserID] = useState("")
  const handleSearch = () => {
    setIsSearching(true)
  }

  const handleBack = () => {
    setIsSearching(false)
    setSearchQuery("")
  }
  useEffect(() => {
    const fetchAndSetUserID = async () => {
      const fetchedUserID = await getUserId()
      if (fetchedUserID && fetchedUserID !== "") {
        setUserID(fetchedUserID)
      }
    }

    fetchAndSetUserID()
  }, [])
  return (
    <Screen style={$root} preset="scroll">
      {isSearching ? (
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleBack={handleBack}
        />
      ) : (
        <>
          <TextInput
            style={styles.searchBar}
            placeholder="搜尋..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholderTextColor="#666"
          />
          <Text style={styles.name}>推薦</Text>
          <SuggestionCarousel userId={userID} />
          <Text style={styles.name}>我的最愛</Text>
          <FavoriteCarousel userId={userID} />
        </>
      )}
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
  searchBar: {
    fontSize: 18,
    padding: 8,
    margin: 24,
    borderWidth: 1,
    borderRadius: 8,
  },
})

export default ExploreScreen
