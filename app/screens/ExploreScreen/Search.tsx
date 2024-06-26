import React, { FC, useState, useEffect } from "react"
import { View, TextInput, Pressable, StyleSheet, Text } from "react-native"

import { supabase, getUserId } from "../../utils/supabase"
import type { SearchProps, MediaItem } from "./types"
import SBImageItem from "./SBImageItem"
import { Button } from "app/components"
const Search: FC<SearchProps> = ({ searchQuery, setSearchQuery, handleBack }) => {
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
    if (userID) {
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
        if (selectedFilter !== "all") {
          if (selectedFilter === "videos") {
            query = query.eq("is_video", true)
          } else if (selectedFilter === "images") {
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
    }
  }, [searchQuery, selectedFilter, userID])

  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter)
  }

  return (
    <View style={styles.searchContainer}>
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
              userId={userID}
              isScrolling={false}
            />
          </View>
        ))}
      </View>
      <Button onPress={handleBack}>返回</Button>
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
