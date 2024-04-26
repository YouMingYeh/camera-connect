import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, Image, Text, ScrollView, StyleSheet } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { ExpandableSection } from "./ExpandableSection"
import ProfileSettings from "./ProfileSettings"
import FriendsContent from "./FriendsContent"
import AlbumsContent from "./AlbumsContent"
import { useState, useEffect } from "react"

import { supabase } from "../../config/initSupabase"
interface ProfileScreenProps extends AppStackScreenProps<"Profile"> {}

import type { SupabaseClient } from "@supabase/supabase-js"
async function readUserInfo(supabaseClient: SupabaseClient, userId: string) {
  const { data, error } = await supabaseClient
    .from("user")
    .select("username, avatar_url")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Failed to fetch user info:", error.message)
    return null
  }

  return data
}

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen() {
  const [userInfo, setUserInfo] = useState({ username: "", avatar_url: "" })

  useEffect(() => {
    const fetchData = async () => {
      const userData = await readUserInfo(supabase, "3a05e507-972c-4579-ae3c-3eb38138780f")
      if (userData) {
        setUserInfo(userData)
      }
    }

    fetchData()
  }, [])
  return (
    <Screen preset="fixed">
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: userInfo.avatar_url || "default_avatar_placeholder.png" }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{userInfo.username || "Username"}</Text>

        <ProfileSettings />

        <ExpandableSection title="Friends">
          <FriendsContent />
        </ExpandableSection>
        <ExpandableSection title="Albums">
          <AlbumsContent />
        </ExpandableSection>
      </ScrollView>
    </Screen>
  )
})

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 72,
  },
  avatarContainer: {
    marginTop: 32,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  name: {
    fontWeight: "800",
    fontSize: 28,
    marginTop: 16,
    marginBottom: 16,
  },
})
