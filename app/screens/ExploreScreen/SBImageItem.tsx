import { View, Text, Pressable, Modal, StyleSheet } from "react-native"
import type { MediaItem } from "./types"
import { Image } from "expo-image"
import { Button, Card, Icon } from "app/components"
import { colors } from "app/theme"
import React, { useState, useEffect } from "react"
import { supabase } from "../../utils/supabase"

interface Props {
  style?: any
  index?: number
  img: any
  media: MediaItem
  userId: string
  isScrolling: boolean
}

const SBImageItem: React.FC<Props> = ({
  style,
  index: _index,
  img,
  media,
  userId,
  isScrolling,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [thumbs_up, setThumbs_up] = useState(false)
  const [sad, setSad] = useState(false)
  const [smile, setSmile] = useState(false)
  const [angry, setAngry] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const index = _index ?? 0

  const handleToggleReaction = async (reaction: string) => {
    const currentReactionState = {
      thumbs_up,
      sad,
      smile,
      angry,
    }

    const newReactionState = {
      ...currentReactionState,
      [reaction]: !currentReactionState[reaction as keyof typeof currentReactionState],
    }

    setThumbs_up(newReactionState.thumbs_up)
    setSad(newReactionState.sad)
    setSmile(newReactionState.smile)
    setAngry(newReactionState.angry)

    const { data: existingReaction, error } = await supabase
      .from("react")
      .select("*")
      .eq("user_id", userId)
      .eq("media_id", media.id)
      .single()

    if (existingReaction) {
      const { error } = await supabase
        .from("react")
        .update(newReactionState)
        .eq("user_id", userId)
        .eq("media_id", media.id)

      if (error) {
        console.error("Error updating reaction:", error)
      }
    } else {
      const { error } = await supabase.from("react").insert({
        user_id: userId,
        media_id: media.id,
        ...newReactionState,
      })

      if (error) {
        console.error("Error inserting reaction:", error)
      }
    }
  }

  useEffect(() => {
    if (modalVisible) {
      const fetchReactions = async () => {
        const { data, error } = await supabase
          .from("react")
          .select("*")
          .eq("user_id", userId)
          .eq("media_id", media.id)
          .single()

        if (data) {
          setThumbs_up(data.thumbs_ups_up)
          setSad(data.sad)
          setSmile(data.smile)
          setAngry(data.angry)
        }
      }

      const fetchUsername = async () => {
        const { data, error } = await supabase
          .from("user")
          .select("username")
          .eq("id", media.uploader_id)
          .single()
        if (data) {
          setUsername(data.username)
        }
      }

      fetchReactions()
      fetchUsername()
    }
  }, [modalVisible, media.uploader_id, media.id, userId])

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={() => !isScrolling && setModalVisible(true)} style={styles.pressable}>
        <Image cachePolicy={"memory-disk"} key={index} style={styles.image} source={img} />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image cachePolicy={"memory-disk"} key={index} style={styles.modalImage} source={img} />
            <Card
              style={styles.descriptionCard}
              ContentComponent={
                <>
                  <Text style={styles.title}>{media.title ? media.title : "No title"}</Text>
                  <Text style={styles.description}>
                    {"創建時間： " + new Date(media.created_at).toLocaleDateString()}
                  </Text>
                  <Text style={styles.description}>
                    {"作者： " + (username ? username : "Loading...")}
                  </Text>
                  <Text style={styles.description}>{"標籤： " + media.hashtag.join(", ")}</Text>
                </>
              }
            />
            <View style={styles.reactCard}>
              <View style={styles.icons}>
                <Pressable onPress={() => handleToggleReaction("thumbs_up")}>
                  <Icon
                    icon="thumb"
                    size={30}
                    color={thumbs_up ? colors.tint : "black"}
                    label="albumScreen.reaction.thumbs_up"
                  />
                </Pressable>
                <Pressable onPress={() => handleToggleReaction("sad")}>
                  <Icon
                    icon="sad"
                    size={30}
                    color={sad ? colors.tint : "black"}
                    label="albumScreen.reaction.sad"
                  />
                </Pressable>
                <Pressable onPress={() => handleToggleReaction("smile")}>
                  <Icon
                    icon="smile"
                    size={30}
                    color={smile ? colors.tint : "black"}
                    label="albumScreen.reaction.smile"
                  />
                </Pressable>
                <Pressable onPress={() => handleToggleReaction("angry")}>
                  <Icon
                    icon="angry"
                    size={30}
                    color={angry ? colors.tint : "black"}
                    label="albumScreen.reaction.angry"
                  />
                </Pressable>
              </View>
            </View>
            {/* <Pressable style={styles.button} onPress={() => setModalVisible(!modalVisible)}> */}
            <Button
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}
              preset="reversed"
            >
              關閉
            </Button>
            {/* </Pressable> */}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
    overflow: "hidden",
  },
  pressable: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 15,
  },
  descriptionCard: {},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    color: "black",
  },
  description: {
    color: "black",
    alignSelf: "center",
  },
  reactCard: {
    width: "100%",
    marginTop: 30,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    marginTop: 30,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
})

export default SBImageItem
