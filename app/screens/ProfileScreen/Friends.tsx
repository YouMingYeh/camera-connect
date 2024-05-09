import React, { useState, useEffect } from "react"
import { View, TextInput, StyleSheet, Pressable, Text, Image } from "react-native"
import { Feather } from "@expo/vector-icons"
import { supabase, getUserId } from "../../utils/supabase"
interface User {
  id: string
  username: string
  avatar_url: string
  email: string
  isFriend: boolean
}
const Friends = () => {
  const [expanded, setExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [userId, setUserId] = useState("")

  const handlePress = () => {
    if (expanded) {
      setSearchQuery("")
      setSearchResults([])
    }
    setExpanded(!expanded)
  }
  const checkFriendshipStatus = async (userIdToCheck: string) => {
    try {
      const { data, error } = await supabase
        .from("friends_with")
        .select("receiver_id, sender_id")
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${userIdToCheck}),and(receiver_id.eq.${userId},sender_id.eq.${userIdToCheck})`,
        )

      if (error) {
        console.error("Failed to fetch friendship status:", error.message)
        return false
      }
      return data.length > 0
    } catch (err) {
      console.error("An error occurred while fetching friendship status:", err)
      return false
    }
  }

  const handleSearch = async () => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("id, username, avatar_url, email")
        .neq("id", userId)
        .or(`email.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`)

      if (error) {
        console.error("Search error:", error.message)
        return
      }

      const enrichedData = await Promise.all(
        data.map(async (user) => {
          const isFriend = await checkFriendshipStatus(user.id)
          return {
            ...user,
            isFriend: isFriend,
          }
        }),
      )

      setSearchResults(enrichedData)
    } catch (err) {
      console.error("An error occurred:", err)
    }
  }

  const handleFriendAction = async (receiverId: string, isFriend: boolean) => {
    if (isFriend) {
      try {
        const { error } = await supabase
          .from("friends_with")
          .delete()
          .or(
            `and(sender_id.eq.${userId},receiver_id.eq.${receiverId}),and(receiver_id.eq.${userId},sender_id.eq.${receiverId})`,
          )
        if (error) {
          console.error("Failed to delete friend:", error.message)
        } else {
          console.log("Friend deleted:", receiverId)
          setSearchResults((prevResults) =>
            prevResults.map((user) =>
              user.id === receiverId ? { ...user, isFriend: false } : user,
            ),
          )
        }
      } catch (err) {
        console.error("An error occurred while deleting a friend:", err)
      }
    } else {
      try {
        const { error } = await supabase
          .from("friends_with")
          .insert([{ sender_id: userId, receiver_id: receiverId }])

        if (error) {
          console.error("Failed to add friend:", error.message)
        } else {
          console.log("Friend added:", receiverId)

          setSearchResults((prevResults) =>
            prevResults.map((user) =>
              user.id === receiverId ? { ...user, isFriend: true } : user,
            ),
          )
        }
      } catch (err) {
        console.error("An error occurred while adding a friend:", err)
      }
    }
  }
  useEffect(() => {
    const fetchAndSetUserID = async () => {
      const fetchedUserID = await getUserId()
      if (fetchedUserID && fetchedUserID !== "") {
        setUserId(fetchedUserID)
      }
    }

    fetchAndSetUserID()
  }, [])
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
          {searchResults.map((item) => (
            <View style={styles.userRow} key={item.id}>
              <Image
                source={{ uri: item.avatar_url || "default_avatar_placeholder.png" }}
                style={styles.avatar}
              />
              <Text style={styles.username}>{item.username}</Text>
              <Pressable
                style={styles.addButton}
                onPress={() => handleFriendAction(item.id, item.isFriend)}
              >
                <Text style={styles.addButtonText}>
                  {item.isFriend ? "Delete Friend" : "Add Friend"}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
    backgroundColor: "white",
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
  expandButton: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: "black",
    marginTop: 16,
    borderRadius: 4,
    width: 300,
    alignSelf: "center",
  },
  expandButtonIcon: {
    position: "absolute",
    right: 16,
  },
  scrollContentContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  expandButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
  },
  username: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  addButton: {
    padding: 10,
    borderRadius: 4,
    marginLeft: 12,
    backgroundColor: "black",
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
})

export default Friends
