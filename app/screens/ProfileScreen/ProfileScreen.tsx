import { observer } from "mobx-react-lite"
import { View, Image, Text, StyleSheet, Pressable } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { LoadingModal, Screen } from "app/components"
import ProfileSettings from "./ProfileSettings"
import Friends from "./Friends"
import Albums from "./Albums"
import React, { FC, useEffect, useState } from "react"
import { supabase, getUserId } from "../../utils/supabase"
import { useStores } from "../../models"

import type { SupabaseClient } from "@supabase/supabase-js"
import { useHeader } from "app/utils/useHeader"
interface ProfileScreenProps extends AppStackScreenProps<"Profile"> {}
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

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen(_props) {
  const { navigation } = _props
  const {
    authenticationStore: { setAuthToken },
  } = useStores()
  const { userStores } = useStores()
  const [userID, setUserID] = useState("")
  async function signout() {
    const { error } = await supabase.auth.signOut()
    if (error) return
    setAuthToken("")
  }
  useEffect(() => {
    const fetchAndSetUserID = async () => {
      const fetchedUserID = await getUserId()
      if (fetchedUserID && fetchedUserID !== "") {
        setUserID(fetchedUserID)
      }
    }

    fetchAndSetUserID()
  }, [])

  useHeader(
    {
      title: "個人資料",
      leftIcon: "caretLeft",
      titleStyle: { fontSize: 24, padding: 10 },
      onLeftPress: () => navigation.navigate("Welcome"),
    },
    [],
  )

  useEffect(() => {
    const fetchData = async () => {
      if (userID) {
        const userData = await readUserInfo(supabase, userID)
        if (userData) {
          userStores.setUserInfo(userData)
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
      <LoadingModal />
      <View style={styles.contentContainerStyle}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: userStores.userInfo.avatar_url || "default_avatar_placeholder.png" }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{userStores.userInfo.username || "Username"}</Text>

        <ProfileSettings />
        <Friends />

        <Albums />
        <Pressable style={styles.button} onPress={signout}>
          <Text style={styles.buttonText}>登出</Text>
        </Pressable>
      </View>
    </Screen>
  )
})
const styles = StyleSheet.create({
  avatar: {
    borderRadius: 90,
    height: 180,
    width: 180,
  },
  avatarContainer: {
    marginTop: 32,
  },
  button: {
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 4,
    elevation: 3,
    height: 60,
    justifyContent: "center",
    marginTop: 10,
    paddingHorizontal: 32,
    paddingVertical: 12,
    width: 300,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  contentContainerStyle: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingVertical: 32,
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
    marginTop: 16,
  },
})
