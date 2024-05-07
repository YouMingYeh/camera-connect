import React, { useState } from "react"
import { View, TextInput, StyleSheet, Pressable, Text, Image, FlatList } from "react-native"
import { Feather } from "@expo/vector-icons"
import { supabase, get_userid } from "../../utils/supabase"
interface User {
  id: string
  username: string
  avatar_url: string
  email: string
}
const Friends = () => {
  const [expanded, setExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])

  const handlePress = () => {
    setExpanded(!expanded)
  }

  const handleSearch = async () => {
    console.log("Searching for:", searchQuery)
    try {
      const { data, error } = await supabase
        .from("user")
        .select("id, username, avatar_url, email")
        .or(`email.eq.${searchQuery},username.ilike.%${searchQuery}%`)

      if (error) {
        console.error("Search error:", error.message)
        return
      }
      console.log("Search results:", data)
      setSearchResults(data)
    } catch (err) {
      console.error("An error occurred:", err)
    }
  }

  const addFriend = async (receiverId: string) => {
    const userId = await get_userid()

    if (!userId) {
      console.error("User ID not found")
      return
    }

    try {
      const { data, error } = await supabase
        .from("friends_with")
        .insert([{ sender_id: userId, receiver_id: receiverId }])

      if (error) {
        console.error("Error adding friend:", error.message)
      }
    } catch (err) {
      console.error("An error occurred:", err)
    }
  }

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.userRow}>
      <Image
        source={{ uri: item.avatar_url || "default_avatar_placeholder.png" }}
        style={styles.avatar}
      />
      <Text style={styles.username}>{item.username}</Text>
      <Pressable style={styles.addButton} onPress={() => addFriend(item.id)}>
        <Text style={styles.addButtonText}>Add Friend</Text>
      </Pressable>
    </View>
  )

  return (
    <View>
      <Pressable style={styles.expandButton} onPress={handlePress}>
        <Text style={styles.expandButtonText}>Friends</Text>
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
          <FlatList data={searchResults} renderItem={renderItem} keyExtractor={(item) => item.id} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "black",
    borderRadius: 4,
    marginLeft: 12,
    padding: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
  },
  avatar: {
    borderRadius: 25,
    height: 50,
    width: 50,
  },
  button: {
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 4,
    elevation: 3,
    justifyContent: "center",
    marginTop: 10,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  container: {
    alignItems: "center",
    width: "100%",
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
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    height: 40,
    marginVertical: 12,
    padding: 10,
    width: "80%",
  },
  userRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },
  username: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
})

export default Friends
