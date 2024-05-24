/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-color-literals */
import React, { useState, useEffect } from "react"
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native"
import { Icon } from "./Icon"
import { Media } from "app/models/Media"
import { Card } from "./Card"
import { Text } from "./Text"
import { colors } from "app/theme"
import { Button } from "./Button"
import { supabase, getUserId } from "app/utils/supabase"

interface GalleryProps {
  medias: Media[]
}

export default function Gallery({ medias }: GalleryProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [modalOpacity] = useState(new Animated.Value(0))
  const [heart, setHeart] = useState(false)
  const [thumbs_up, setThumbs_up] = useState(false)
  const [sad, setSad] = useState(false)
  const [smile, setSmile] = useState(false)
  const [angry, setAngry] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId()
      setUserId(id)
    }
    fetchUserId()
  }, [])

  useEffect(() => {
    if (activeIndex !== null && medias[activeIndex]) {
      fetchReactions(medias[activeIndex].id)
    }
  }, [activeIndex])

  const fetchReactions = async (mediaId: string) => {
    if (!userId) return
    const { data, error } = await supabase
      .from("react")
      .select("*")
      .eq("user_id", userId)
      .eq("media_id", mediaId)
      .single()

    if (data) {
      setThumbs_up(data.thumbs_up)
      setSad(data.sad)
      setSmile(data.smile)
      setAngry(data.angry)
    } else {
      setThumbs_up(false)
      setSad(false)
      setSmile(false)
      setAngry(false)
    }
  }

  const handleToggleReaction = async (reaction: string) => {
    if (!userId || activeIndex === null) return
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

    const mediaId = medias[activeIndex].id

    const { data: existingReaction, error } = await supabase
      .from("react")
      .select("*")
      .eq("user_id", userId)
      .eq("media_id", mediaId)
      .single()

    if (existingReaction) {
      const { error } = await supabase
        .from("react")
        .update(newReactionState)
        .eq("user_id", userId)
        .eq("media_id", mediaId)

      if (error) {
        console.error("Error updating reaction:", error)
      }
    } else {
      const { error } = await supabase.from("react").insert({
        user_id: userId,
        media_id: mediaId,
        ...newReactionState,
      })

      if (error) {
        console.error("Error inserting reaction:", error)
      }
    }
  }

  const animateModal = (toValue: number, callback?: () => void) => {
    Animated.timing(modalOpacity, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (callback) {
        callback()
      }
    })
  }

  const handleOpenImage = (index: number) => {
    setActiveIndex(index)
    setModalVisible(true)
    animateModal(1)
  }

  const handleCloseImage = () => {
    animateModal(0, () => {
      modalOpacity.setValue(0)
      setModalVisible(false)
      setActiveIndex(null)
    })
  }

  const screenWidth = Dimensions.get("window").width
  const imageWidth = screenWidth / 4

  return (
    <View style={styles.container}>
      {medias &&
        medias.map((item, index) => (
          <TouchableOpacity key={item.id} onPress={() => handleOpenImage(index)}>
            <Image source={{ uri: item.url }} style={{ ...styles.image, width: imageWidth }} />
          </TouchableOpacity>
        ))}
      <Modal visible={modalVisible} transparent={true} onRequestClose={handleCloseImage}>
        <Animated.View style={{ ...styles.modalContainer, opacity: modalOpacity }}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseImage}>
            <Icon size={30} icon="x" color="black" />
          </TouchableOpacity>

          {activeIndex !== null && medias[activeIndex] && (
            <>
              <Image source={{ uri: medias[activeIndex].url }} style={styles.modalImage} />
              <Card
                style={{ margin: 20 }}
                ContentComponent={
                  <>
                    <Text
                      style={styles.title}
                      text={
                        (medias[activeIndex].title
                          ? medias[activeIndex].title
                          : "No title") as string
                      }
                    />

                    <Text
                      style={styles.description}
                      text={new Date(medias[activeIndex].created_at).toLocaleDateString()}
                    />

                    <Text
                      style={styles.description}
                      text={"上傳者：" + medias[activeIndex].uploader?.username}
                    />
                    <Text
                      style={styles.description}
                      text={"hashtags: " + medias[activeIndex].hashtag?.join(", ")}
                    />
                    <View style={styles.iconsContainer}>
                      <TouchableOpacity onPress={() => handleToggleReaction("thumbs_up")}>
                        <Icon
                          icon="thumb"
                          size={30}
                          color={thumbs_up ? colors.tint : "black"}
                          label="albumScreen.reaction.thumb"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleToggleReaction("sad")}>
                        <Icon
                          icon="sad"
                          size={30}
                          color={sad ? colors.tint : "black"}
                          label="albumScreen.reaction.sad"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleToggleReaction("smile")}>
                        <Icon
                          icon="smile"
                          size={30}
                          color={smile ? colors.tint : "black"}
                          label="albumScreen.reaction.smile"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleToggleReaction("angry")}>
                        <Icon
                          icon="angry"
                          size={30}
                          color={angry ? colors.tint : "black"}
                          label="albumScreen.reaction.angry"
                        />
                      </TouchableOpacity>
                    </View>
                    <Button style={styles.button} onPress={handleCloseImage} preset="reversed">
                      關閉
                    </Button>
                  </>
                }
              />
            </>
          )}
        </Animated.View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    height: "100%",
    width: "100%",
  },
  image: {
    height: 100,
  },
  modalCloseButton: {
    borderRadius: 5,
    padding: 10,
    position: "absolute",
    right: 20,
    top: 40,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 20,
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    flex: 1,
    justifyContent: "center",
    padding: 0,
  },
  modalImage: {
    height: "50%",
    resizeMode: "contain",
    width: "100%",
  },
  title: {
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
  },
  description: {
    alignSelf: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  button: {
    marginTop: 20,
    width: "30%",
    alignSelf: "center",
  },
})
