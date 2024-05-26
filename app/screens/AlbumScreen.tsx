/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import {
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  Animated,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native"
import { Image } from "expo-image"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card, Icon, LoadingModal, Screen, Text } from "app/components"
import { useStores } from "app/models"
import { getUserId, supabase } from "app/utils/supabase"
import TinderCard from "react-tinder-card"
import { Media } from "app/models/Media"
import Gallery from "app/components/Gallery"
import { ScrollView } from "react-native-gesture-handler"
import { BlurView } from "expo-blur"
import { colors } from "app/theme"
import * as ImagePicker from "expo-image-picker"
import { v4 as uuidv4 } from "uuid"
import { useHeader } from "app/utils/useHeader"
import Tooltip from "react-native-walkthrough-tooltip"
import { createMedia, uploadImage } from "./helper/utils"

interface AlbumScreenProps extends AppStackScreenProps<"Album"> {}

type MediaCreate = {
  id: string
  title: string
  is_video: boolean
  url: string
  album_id: string
  uploader_id: string
  hashtag: string[]
}

export const AlbumScreen: FC<AlbumScreenProps> = observer(function AlbumScreen(_props) {
  const { mediaStore, mediaViewedStore } = useStores()
  const { albumId, albumName } = _props.route.params
  const [medias, setMedias] = React.useState<Media[]>([])
  const [direction, setDirection] = React.useState("")
  const [intensity, setIntensity] = React.useState(10)
  const [showingHeart, setShowingHeart] = React.useState(false)
  const [heartScale, setHeartScale] = React.useState(new Animated.Value(0))
  const [thumbs_up, setThumbs_up] = React.useState(false)
  const [sad, setSad] = React.useState(false)
  const [smile, setSmile] = React.useState(false)
  const [angry, setAngry] = React.useState(false)
  const [modalVisible, setModalVisible] = React.useState(false)
  const [selectedImages, setSelectedImages] = React.useState<string[]>([])
  const [currentMediaId, setCurrentMediaId] = React.useState<string | null>(null)
  const [skipped, setSkipped] = React.useState(false)
  const [heart, setHeart] = React.useState(false)
  const [tooltipVisible, setTooltipVisible] = React.useState(true)
  function animateHeart() {
    Animated.timing(heartScale, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  function goBack() {
    _props.navigation.goBack()
  }

  useEffect(() => {
    mediaStore.fetchMedias(supabase, albumId).then(() => {
      const newMedias = mediaStore.medias.filter(
        (media) => !mediaViewedStore.mediaIdsSet.has(media.id),
      )
      setMedias(newMedias)
      if (mediaStore.medias.length > 0) {
        setCurrentMediaId(mediaStore.medias[mediaStore.medias.length - 1].id)
        fetchReactions(mediaStore.medias[mediaStore.medias.length - 1].id)
      }
    })
  }, [albumId])

  function onSwipe(direction: string, myIdentifier: string) {
    setDirection(direction)
    if (direction === "right") {
      setShowingHeart(true)
      heartScale.setValue(0)
      animateHeart()
      setHeart(true)
      handleToggleReaction("heart", myIdentifier)
      setTimeout(() => {
        setShowingHeart(false)
        heartScale.setValue(0)
      }, 1000)
    }
    mediaViewedStore.addMediaId(myIdentifier)
    setMedias((prev) => {
      const remainingMedias = prev.filter((media) => media.id !== myIdentifier)
      if (remainingMedias.length > 0) {
        setCurrentMediaId(remainingMedias[remainingMedias.length - 1].id)
        fetchReactions(remainingMedias[remainingMedias.length - 1].id)
      }
      return remainingMedias
    })
    setThumbs_up(false)
    setSad(false)
    setSmile(false)
    setAngry(false)
    setHeart(false)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (medias.length !== 0) {
      setIntensity(10)
    } else {
      interval = setInterval(() => {
        setIntensity((prev) => prev - 1)
        if (intensity === 0) {
          clearInterval(interval as NodeJS.Timeout)
        }
      }, 100)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [medias])

  const fetchReactions = async (mediaId: string) => {
    const userId = await getUserId()
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

  const handleToggleReaction = async (reaction: string, mediaId: string | null) => {
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
    const userId = await getUserId()
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

  async function handleUploadToAlbum() {
    if (selectedImages.length === 0) {
      Alert.alert("出錯了！", "你沒有選擇照片！")
      return
    }
    const userId = await getUserId()
    if (!userId) {
      Alert.alert("出錯了！", "找不到使用者")
      return
    }
    const mediaCreates: MediaCreate[] = selectedImages.map(() => {
      const uuid = uuidv4()
      return {
        id: uuid,
        title: "沒有標題",
        is_video: false,
        url:
          "https://adjixakqimigxsubirmn.supabase.co/storage/v1/object/public/media/media-" + uuid,
        album_id: albumId,
        uploader_id: userId,
        hashtag: [],
      }
    })

    for (let i = 0; i < selectedImages.length; i++) {
      await uploadImage(supabase, selectedImages[i], "media-" + mediaCreates[i].id)
    }

    await createMedia(supabase, mediaCreates)
    await mediaStore.fetchMedias(supabase, albumId).then(() => {
      setMedias(mediaStore.medias)
    })
    setSelectedImages([])
    setModalVisible(false)
    Alert.alert("成功了！", "照片已經上傳到相簿，快去看看吧！")
  }
  async function handleUploadImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      base64: true,
      allowsMultipleSelection: true,
    })

    if (!result.canceled) {
      setSelectedImages(result.assets.map((asset) => asset.base64 || ""))
    }
  }

  // useEffect(() => {
  //   mediaViewedStore.clearMediaIds()
  // }, [])

  useHeader(
    {
      title: albumName,
      leftIcon: "caretLeft",
      titleStyle: { fontSize: 24, padding: 10 },
      onLeftPress: () => _props.navigation.goBack(),
      rightIcon: "upload",
      onRightPress: () => setModalVisible(true),
    },
    [],
  )
  return (
    <Screen style={$root}>
      <LoadingModal duration={1000} />
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            gap: 10,
          }}
        >
          <Card
            style={{
              width: "90%",
              height: "50%",
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              alignItems: "center",
            }}
            ContentComponent={
              <>
                <Text text="你選擇的照片：" />
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  {selectedImages.map((base64, index) => (
                    <Image
                      key={index}
                      source={{ uri: `data:image/jpg;base64,${base64}` }}
                      style={{ height: 100, width: 100 }}
                    />
                  ))}
                </View>
              </>
            }
          />
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Button onPress={() => setModalVisible(false)}>取消</Button>
            <Button onPress={handleUploadImage} preset="filled">
              從相簿中選擇
            </Button>
            <Button onPress={handleUploadToAlbum} preset="reversed">
              立即上傳
            </Button>
          </View>
        </View>
      </Modal>
      <View style={$screen}>
        <BlurView intensity={intensity} style={[$backdrop, { zIndex: intensity < 2 ? -1 : 10 }]} />

        {medias.length !== 0 && !skipped && (
          <View style={$container}>
            {/* <Text tx="albumScreen.swipeHint" style={{color: colors.text, alignSelf: "center"}} /> */}

            <Tooltip
              isVisible={tooltipVisible}
              content={<Text>👇 右滑喜歡！</Text>}
              onClose={() => setTooltipVisible(false)}
            >
              <Text></Text>
            </Tooltip>
            {medias.map((media) => (
              <TinderCard
                key={media.id}
                onSwipe={(dir) => onSwipe(dir, media.id)}
                preventSwipe={["up", "down"]}
              >
                <View style={$imageContainer}>
                  <Image source={{ uri: media.url }} style={$image} />
                </View>
              </TinderCard>
            ))}

            {showingHeart && (
              <Animated.View
                style={{
                  position: "absolute",
                  left: "50%",
                  zIndex: 80,
                  transform: [{ translateX: -5 }, { translateY: 250 }, { scale: heartScale }],
                }}
              >
                <View>
                  <Icon icon="heartFill" size={60} color="red" />
                </View>
              </Animated.View>
            )}
            <Card
              style={$descriptionCard}
              ContentComponent={
                <>
                  <Text
                    style={$title}
                    text={
                      (medias[medias.length - 1].title
                        ? medias[medias.length - 1].title
                        : "沒有標題") as string
                    }
                  />

                  <Text
                    style={$description}
                    text={
                      "創建時間：" +
                      new Date(medias[medias.length - 1].created_at).toLocaleDateString()
                    }
                  />

                  <Text
                    style={$description}
                    text={"作者：" + medias[medias.length - 1].uploader?.username}
                  />
                  {medias[medias.length - 1].hashtag?.length !== 0 ? (
                    <Text
                      style={$description}
                      text={"標籤：" + medias[medias.length - 1].hashtag?.join(", ")}
                    />
                  ) : (
                    <Text text={" "}></Text>
                  )}
                  <View style={$icons}>
                    <TouchableOpacity
                      onPress={() => handleToggleReaction("thumbs_up", currentMediaId)}
                    >
                      <Icon icon="thumb" size={30} color={thumbs_up ? colors.tint : "black"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleToggleReaction("sad", currentMediaId)}>
                      <Icon icon="sad" size={30} color={sad ? colors.tint : "black"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleToggleReaction("smile", currentMediaId)}>
                      <Icon icon="smile" size={30} color={smile ? colors.tint : "black"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleToggleReaction("angry", currentMediaId)}>
                      <Icon icon="angry" size={30} color={angry ? colors.tint : "black"} />
                    </TouchableOpacity>
                  </View>
                </>
              }
            />
            <View style={$reactCard}>
              <Button onPress={() => setMedias([])} preset="reversed">
                跳過全部
              </Button>
            </View>
          </View>
        )}
        <ScrollView style={$galleryContainer}>
          {mediaStore.medias && (
            <Gallery medias={mediaStore.medias} updateMedia={mediaStore.updateMedia} />
          )}
        </ScrollView>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
}

const $screen: ViewStyle = {
  width: "100%",
  height: "100%",
}

const $title: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
  alignSelf: "center",
  color: "black",
  padding: 10,
}

const $descriptionCard: ViewStyle = {
  transform: [{ translateY: 330 }],
}

const $description: TextStyle = {
  color: "black",
  alignSelf: "center",
}

const $reactCard: ViewStyle = {
  transform: [{ translateY: 330 }],
  width: "100%",
  flex: 1,
  alignItems: "center",
  marginTop: 20,
}

const $icons: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-around",
  width: "100%",
  marginTop: 20,
}

const $backdrop: ViewStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
}

const $container: ViewStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  padding: 20,
  zIndex: 50,
  paddingTop: 100,
}

const $imageContainer: ViewStyle = {
  position: "absolute",
  width: "100%",
  height: 300,
  shadowColor: "black",
  shadowOpacity: 0.2,
  shadowRadius: 20,
}

const $galleryContainer: ViewStyle = {
  alignSelf: "stretch",
  backgroundColor: colors.palette.neutral300,
}

const $image: ImageStyle = {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
  borderRadius: 20,
  zIndex: 100,
}
