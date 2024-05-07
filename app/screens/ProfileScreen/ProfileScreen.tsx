import { observer } from "mobx-react-lite"
import { View, Image, Text, ScrollView, StyleSheet, Pressable } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { ExpandableSection } from "./ExpandableSection"
import ProfileSettings from "./ProfileSettings"
import Friends from "./Friends"
import AlbumsContent from "./AlbumsContent"
import React, { FC, useEffect, useState } from "react"
import { supabase, get_userid } from "../../utils/supabase"
import { useStores } from "../../models"
import { userStore } from "../../stores/userStore"
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
  const {
    authenticationStore: { setAuthToken },
  } = useStores()
  const { userInfo } = userStore
  const [userID, setUserID] = useState("")
  async function signout() {
    const { error } = await supabase.auth.signOut()
    if (error) return
    setAuthToken("")
  }
  useEffect(() => {
    const fetchAndSetUserID = async () => {
      const fetchedUserID = await get_userid()
      if (fetchedUserID && fetchedUserID !== "") {
        setUserID(fetchedUserID)
      }
    }

    fetchAndSetUserID()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (userID) {
        const userData = await readUserInfo(supabase, userID)
        if (userData) {
          userStore.setUserInfo(userData)
        } else {
          console.error("No user data returned with userID: ", userID)
        }
      } else {
        console.log("No userID available to fetch data")
      }
    }

    if (userID) {
      fetchData()
    }
  }, [userID])

  return (
    <Screen preset="scroll">
      <ScrollView contentContainerStyle={styles.contentContainerStyle} >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: userInfo.avatar_url || "default_avatar_placeholder.png" }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{userInfo.username || "Username"}</Text>

        <ProfileSettings />
		<Friends />
       
        <ExpandableSection title="Albums">
          <AlbumsContent />
        </ExpandableSection>
        <Pressable style={styles.button} onPress={signout}>
          <Text style={styles.buttonText}>登出</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  )
})
const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 32,
	
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
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    marginTop: 10,
    height: 60,
    width: 300,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
})
