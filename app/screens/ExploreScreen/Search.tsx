import React, { FC, useState, useEffect } from "react"
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from "react-native"
import { supabase } from "../../utils/supabase"
import type { SearchProps, MediaItem } from "./types"
import { Image } from "expo-image"

const Search: FC<SearchProps> = ({ searchQuery, setSearchQuery, handleBack, type, setType }) => {
  const [searchResults, setSearchResults] = useState<MediaItem[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  useEffect(() => {
    const fetchSearchResults = async () => {
      let query = supabase.from("media").select("*")

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
        <Text>Back</Text>
      </Pressable>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />
      <View style={styles.filters}>
        <Pressable
          onPress={() => handleFilterPress("all")}
          style={[styles.filterButton, selectedFilter === "all" && styles.selectedFilter]}
        >
          <Text style={styles.filterText}>All</Text>
        </Pressable>
        <Pressable
          onPress={() => handleFilterPress("videos")}
          style={[styles.filterButton, selectedFilter === "videos" && styles.selectedFilter]}
        >
          <Text style={styles.filterText}>Videos</Text>
        </Pressable>
        <Pressable
          onPress={() => handleFilterPress("images")}
          style={[styles.filterButton, selectedFilter === "images" && styles.selectedFilter]}
        >
          <Text style={styles.filterText}>Images</Text>
        </Pressable>
        <Pressable
          onPress={() => handleFilterPress("favorites")}
          style={[styles.filterButton, selectedFilter === "favorites" && styles.selectedFilter]}
        >
          <Text style={styles.filterText}>Favorites</Text>
        </Pressable>
      </View>

      <View style={styles.container}>
        {searchResults.map((searchResult) => (
          <TouchableWithoutFeedback key={searchResult.id}>
            <Image source={{ uri: searchResult.url }} style={styles.image} />
          </TouchableWithoutFeedback>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
