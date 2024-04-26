import React, { useState } from "react"
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
import { supabase } from "../../config/initSupabase"
import { v4 as uuidv4 } from "uuid"
import { Buffer } from "buffer"
import { Feather } from "@expo/vector-icons"

import type { SupabaseClient } from "@supabase/supabase-js"

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
      .upload(filename, Buffer.from(base64.replace(/data:image\/([^;]+);base64,/, ""), "base64"), {
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
        await updateUser(supabase, {
          id: "3a05e507-972c-4579-ae3c-3eb38138780f",
          ...updates,
        })
      }
      setExpanded(!expanded)
    } catch (error) {
      console.error("Error updating profile:", error)
      Alert.alert("Update Failed")
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const uri = result.assets[0].uri
      const imageData = uri.replace(/dataAimage\/([^A]+)Abase64A/, "")
      setAvatar(imageData)
    }
  }

  const handlePress = () => {
    setExpanded(!expanded)
  }

  return (
    <View>
      <TouchableOpacity style={styles.expandButton} onPress={handlePress}>
        <View style={styles.innerContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.expandButtonText}>Profile Settings</Text>
          </View>
          <Feather name={expanded ? "chevron-up" : "chevron-down"} size={24} color="white" />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholder="Enter your new username"
          />
          <Pressable style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Upload New Avatar</Text>
          </Pressable>
          {avatar && <Image source={{ uri: avatar }} style={styles.avatar} resizeMode="cover" />}
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: "black",
    marginTop: 16,
    borderRadius: 4,
    width: 300,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  expandButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
  },
})

export default ProfileSettingsContent
