import {
  View,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { userStore } from "../../stores/userStore"
import { v4 as uuidv4 } from "uuid"
import { Buffer } from "buffer"
import { Feather } from "@expo/vector-icons"
import React, { useEffect, useState } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"

import { supabase, get_userid } from "../../utils/supabase"
type User = {
  username: string
  id: string
  avatar_url: string
}

export async function updateUser(supabase: SupabaseClient, user: Partial<User>) {
  const { data, error } = await supabase.from("user").update(user).eq("id", user.id).select()

  if (error) {
    throw new Error("Failed to update user data: " + error.message)
  }

  if (!data || data.length === 0) {
    throw new Error("No user data returned after update")
  }

  const new_user: User = data[0]
  return new_user
}

const ProfileSettingsContent = () => {
  const [username, setUsername] = useState("")
  const [avatar, setAvatar] = useState("")
  const [expanded, setExpanded] = useState(false)

  const uploadAvatar = async (filename: string, base64: string) => {
    let { data, error } = await supabase.storage
      .from("avatar")
      .upload(filename, Buffer.from(base64, "base64"), {
        contentType: "image/jpeg",
        upsert: true,
      })
    if (error) {
      throw error
    }
    return data?.path
  }
  const updateProfile = async () => {
    try {
      let updates: { avatar_url?: string; username?: string } = {}

      if (avatar) {
        const filename = `avatars_${uuidv4()}`
        await uploadAvatar(filename, avatar)
        const { data } = supabase.storage.from("avatar").getPublicUrl(filename)

        updates.avatar_url = data.publicUrl
      }

      if (username) {
        updates.username = username
      }
      if (Object.keys(updates).length > 0) {
        const updatedUser = await updateUser(supabase, {
          id: userID,
          ...updates,
        })
        userStore.setUserInfo(updatedUser)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      Alert.alert("Update Failed")
    }
    setExpanded(!expanded)
    setUsername("")
    setAvatar("")
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    })

    if (!result.canceled) {
      const base64 = result.assets[0].base64 || ""
      setAvatar(base64)
    }
  }

  const handlePress = () => {
    setExpanded(!expanded)
  }
  const [userID, setUserID] = useState("")

  useEffect(() => {
    ;(async () => {
      setUserID(await get_userid())
    })()
  }, [])

  const avatarUri = "data:image/jpeg;base64," + avatar

  return (
    <View>
      <TouchableOpacity style={styles.expandButton} onPress={handlePress}>
        <Text style={styles.expandButtonText}>Profile Settings</Text>
        <Feather
          style={styles.expandButtonIcon}
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="white"
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholder="Enter your new username"
            placeholderTextColor="black"
          />
          <Pressable style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload New Avatar</Text>
          </Pressable>
          {avatar ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} resizeMode="cover" />
          ) : null}
          <Pressable style={styles.button} onPress={updateProfile}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 20,
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
  },
  expandButtonIcon: {
    position: "absolute",
    right: 16,
  },

  expandButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
  },
})

export default ProfileSettingsContent
