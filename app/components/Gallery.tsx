/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-color-literals */
import React, { useState, useEffect } from "react"
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
} from "react-native"
import { Image } from "expo-image"
import { Icon } from "./Icon"
import { Media } from "app/models/Media"
import { Card } from "./Card"
import { Text } from "./Text"
import { colors } from "app/theme"
import { Button } from "./Button"
import { supabase, getUserId } from "app/utils/supabase"
import { TextField } from "./TextField"

interface GalleryProps {
  medias: Media[]
  updateMedia: (media: Media) => void
}

export default function Gallery({ medias, updateMedia }: GalleryProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [modalOpacity] = useState(new Animated.Value(0))
  const [heart, setHeart] = useState(false)
  const [thumbs_up, setThumbs_up] = useState(false)
  const [sad, setSad] = useState(false)
  const [smile, setSmile] = useState(false)
  const [angry, setAngry] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [hashtags, setHashtags] = useState<string>()

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
      setHeart(data.heart)
    } else {
      setThumbs_up(false)
      setSad(false)
      setSmile(false)
      setAngry(false)
      setHeart(false)
    }
  }

  const handleToggleReaction = async (reaction: string) => {
    if (!userId || activeIndex === null) return
    const currentReactionState = {
      thumbs_up,
      sad,
      smile,
      angry,
      heart,
    }

    const newReactionState = {
      ...currentReactionState,
      [reaction]: !currentReactionState[reaction as keyof typeof currentReactionState],
    }

    setThumbs_up(newReactionState.thumbs_up)
    setSad(newReactionState.sad)
    setSmile(newReactionState.smile)
    setAngry(newReactionState.angry)
    setHeart(newReactionState.heart)

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

  const handleSubmitEdit = async () => {
    if (!userId || activeIndex === null) return
    const mediaId = medias[activeIndex].id
    const { error } = await supabase
      .from("media")
      .update({
        title,
        hashtag: hashtags?.split(",") || [],
      })
      .eq("id", mediaId)

    if (error) {
      console.error("Error updating media:", error)
      Alert.alert("編輯失敗", "請再試一次")
      return
    }
    Alert.alert("編輯成功", "相片已編輯成功")
    updateMedia({
      ...medias[activeIndex],
      title,
      hashtag: hashtags?.split(",") || [],
    })
    setEditing(false)
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
                          : "沒有標題") as string
                      }
                    />

                    <Text
                      style={styles.description}
                      text={new Date(medias[activeIndex].created_at).toLocaleDateString()}
                    />

                    <Text
                      style={styles.description}
                      text={"作者：" + medias[activeIndex].uploader?.username}
                    />
                    <Text
                      style={styles.description}
                      text={"hashtags: " + medias[activeIndex].hashtag?.join(", ")}
                    />
                    <View style={styles.iconsContainer}>
                      <TouchableOpacity onPress={() => handleToggleReaction("heart")}>
                        {heart ? (
                          <Icon
                            icon="heartFill"
                            size={30}
                            color={"red"}
                            label={(medias[activeIndex].heart + 1).toString()}
                          />
                        ) : (
                          <Icon
                            icon="heart"
                            size={30}
                            color={"black"}
                            label={medias[activeIndex].heart.toString()}
                          />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleToggleReaction("thumbs_up")}>
                        <Icon
                          icon="thumb"
                          size={30}
                          color={thumbs_up ? colors.tint : "black"}
                          label={(thumbs_up
                            ? medias[activeIndex].thumb + 1
                            : medias[activeIndex].thumb
                          ).toString()}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleToggleReaction("sad")}>
                        <Icon
                          icon="sad"
                          size={30}
                          color={sad ? colors.tint : "black"}
                          label={(sad
                            ? medias[activeIndex].sad + 1
                            : medias[activeIndex].sad
                          ).toString()}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleToggleReaction("smile")}>
                        <Icon
                          icon="smile"
                          size={30}
                          color={smile ? colors.tint : "black"}
                          label={(smile
                            ? medias[activeIndex].smile + 1
                            : medias[activeIndex].smile
                          ).toString()}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleToggleReaction("angry")}>
                        <Icon
                          icon="angry"
                          size={30}
                          color={angry ? colors.tint : "black"}
                          label={(angry
                            ? medias[activeIndex].angry + 1
                            : medias[activeIndex].angry
                          ).toString()}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                }
              />
              <View style={{ flexDirection: "row", gap: 20 }}>
                <Button style={styles.button} onPress={handleCloseImage} preset="reversed">
                  關閉
                </Button>
                <Button
                  style={styles.button}
                  onPress={() => {
                    setEditing(!editing)
                    setTitle(medias[activeIndex].title || "")
                    setHashtags(medias[activeIndex].hashtag?.join(",") || "")
                  }}
                  preset="filled"
                >
                  編輯
                </Button>
              </View>
              <Modal visible={editing} transparent>
                <View style={styles.modalContainer}>
                  <Card
                    style={{ margin: 10 }}
                    ContentComponent={
                      <>
                        <Text style={styles.title}>編輯相片</Text>
                        <TextField
                          accessibilityLabel="相簿名稱"
                          testID="title"
                          label="相簿名稱"
                          value={title}
                          placeholder="輸入相簿名稱"
                          onChange={(e) => {
                            setTitle(e.nativeEvent.text)
                          }}
                        />
                        <TextField
                          label="標籤"
                          value={hashtags}
                          placeholder="輸入標籤（以逗號分隔）"
                          onChange={(e) => {
                            setHashtags(e.nativeEvent.text)
                          }}
                        />

                        <View
                          style={{
                            flexDirection: "row",
                            gap: 20,
                            justifyContent: "center",
                            marginTop: 20,
                          }}
                        >
                          <Button
                            style={styles.button}
                            onPress={() => setEditing(false)}
                            preset="reversed"
                          >
                            取消
                          </Button>
                          <Button style={styles.button} onPress={handleSubmitEdit} preset="filled">
                            送出
                          </Button>
                        </View>
                      </>
                    }
                  ></Card>
                </View>
              </Modal>
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
    height: 500,
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
    width: "30%",
    alignSelf: "center",
  },
})
