import React, { useState } from "react"
import { View, TextInput, StyleSheet, Pressable, Text, Image } from "react-native"
import { Feather } from "@expo/vector-icons"
import { supabase, get_userid } from "../../utils/supabase"

interface Album {
  id: string
  album_name: string
  cover_url: string
}
const Albums = () => {
  const [expanded, setExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [albums, setAlbums] = useState<Album[]>([])

  const handlePress = () => {
    if (expanded) {
      setSearchQuery("")
      setAlbums([])
    }
    setExpanded(!expanded)
  }

  const handleSearch = async () => {
    const userId = await get_userid()
    if (!userId) {
      console.error("User ID not found")
      return
    }

    try {
      const { data: joinData, error: joinError } = await supabase
        .from("join_album")
        .select("album_id")
        .eq("user_id", userId)

      if (joinError) {
        console.error("Error fetching album IDs:", joinError.message)
        return
      }

      const albumIds = joinData.map((j) => j.album_id)

      const { data, error } = await supabase
        .from("album")
        .select("id, album_name, cover_url")
        .in("id", albumIds)
        .ilike("album_name", `%${searchQuery}%`)

      if (error) {
        console.error("Error fetching albums:", error.message)
        return
      }

      setAlbums(data)
    } catch (err) {
      console.error("An error occurred while fetching albums:", err)
    }
  }

  return (
    <View>
      <Pressable style={styles.expandButton} onPress={handlePress}>
        <Text style={styles.expandButtonText}>Albums</Text>
        <Feather
          style={styles.expandButtonIcon}
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="white"
        />
      </Pressable>
      {expanded && (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholder="Enter email or name"
            placeholderTextColor="#666"
          />
          <Pressable style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </Pressable>
          {albums.map((item) => (
            <View style={styles.albumRow}>
              <Image
                source={{ uri: item.cover_url || "default_album_placeholder.png" }}
                style={styles.albumCover}
              />
              <Text style={styles.albumName}>{item.album_name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  scrollContentContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  albumCover: {
    borderRadius: 25,
    height: 50,
    width: 50,
  },
  albumName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  albumRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  expandButton: {
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 4,
    height: 60,
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    position: "relative",
    width: 300,
    alignSelf: "center",
  },
  expandButtonIcon: {
    position: "absolute",
    right: 16,
  },
  expandButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
    backgroundColor: "white",
  },
})

export default Albums
