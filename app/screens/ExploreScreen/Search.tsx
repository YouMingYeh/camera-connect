import React, { FC, useState, useEffect } from "react"
import { View, TextInput, Pressable, StyleSheet, Text } from "react-native"

import { getUserId } from "../../utils/supabase"
import { supabase } from "../../utils/supabase"
import type { SearchProps, MediaItem } from "./types"
import SBImageItem from "./SBImageItem"
const Search: FC<SearchProps> = ({ searchQuery, setSearchQuery, handleBack, type, setType }) => {
  const [searchResults, setSearchResults] = useState<MediaItem[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [userID, setUserID] = useState("")
  useEffect(() => {
    const fetchAndSetUserID = async () => {
      const fetchedUserID = await getUserId()
      if (fetchedUserID && fetchedUserID !== "") {
        setUserID(fetchedUserID)
      }
    }

    fetchAndSetUserID()
  }, [])
  useEffect(() => {
    const fetchSearchResults = async () => {
      const { data: albums } = await supabase
        .from("join_album")
        .select("album_id")
        .eq("user_id", userID)

      if (albums === null) {
        setSearchResults([])
        return
      }

      let query = supabase
        .from("media")
        .select("*")
        .in(
          "album_id",
          albums.map((album) => album.album_id),
        )

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,hashtag.cs.{${searchQuery}}`)
      }

      if (type !== "all") {
        if (type === "videos") {
          query = query.eq("is_video", true)
        } else if (type === "images") {
          query = query.eq("is_video", false)
        }
      }

      const { data, error } = await query
      if (error) {
        console.error("Error fetching media:", error)
      } else {
        setSearchResults(data || [])
      }
    }

    fetchSearchResults()
  }, [searchQuery, type])

  const handleFilterPress = (filter: string) => {
    setType(filter)
    setSelectedFilter(filter)
  }

  return (
    <View style={styles.searchContainer}>
      <Pressable onPress={handleBack}>
        <Text>回上一頁</Text>
      </Pressable>
      <TextInput
        style={styles.searchBar}
        placeholder="搜尋..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />
      <View style={styles.filters}>
        <Pressable
          onPress={() => handleFilterPress("all")}
          style={[styles.filterButton, selectedFilter === "all" && styles.selectedFilter]}
        >
          <Text style={styles.filterText}>全部</Text>
        </Pressable>
        <Pressable
          onPress={() => handleFilterPress("videos")}
          style={[styles.filterButton, selectedFilter === "videos" && styles.selectedFilter]}
        >
          <Text style={styles.filterText}>影片</Text>
        </Pressable>
        <Pressable
          onPress={() => handleFilterPress("images")}
          style={[styles.filterButton, selectedFilter === "images" && styles.selectedFilter]}
        >
          <Text style={styles.filterText}>圖片</Text>
        </Pressable>
        {/* <Pressable
          onPress={() => handleFilterPress("favorites")}
          style={[styles.filterButton, selectedFilter === "favorites" && styles.selectedFilter]}
        >
          <Text style={styles.filterText}>Favorites</Text>
        </Pressable> */}
      </View>

      <View style={styles.container}>
        {searchResults.map((searchResult, index) => (
          <View key={searchResult.id} style={styles.itemContainer}>
            <SBImageItem
              media={searchResult}
              img={searchResult.url}
              index={index}
              style={styles.imageItem}
            />
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    width: "50%",
    padding: 5,
  },
  imageItem: {
    width: "100%",
    height: 200,
    borderRadius: 2,
  },
  searchBar: {
    fontSize: 18,
    padding: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  searchContainer: {
    flex: 1,
    padding: 16,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
  },
  selectedFilter: {
    backgroundColor: "#ccc",
  },
  filterText: {
    color: "#000",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    width: "50%",
    height: 200,
  },
})

export default Search
