/* eslint-disable react-native/no-inline-styles */
import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import {
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  Animated,
  TouchableOpacity,
  Modal,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card, Icon, Screen, Text } from "app/components"
import { useStores } from "app/models"
import { getUserId, supabase } from "app/utils/supabase"
import TinderCard from "react-tinder-card"
import { Media } from "app/models/Media"
import Gallery from "app/components/Gallery"
import { ScrollView } from "react-native-gesture-handler"
import { BlurView } from "expo-blur"
import { colors } from "app/theme"
import { GoBackButton } from "app/components/GoBackButton"
import { SupabaseClient } from "@supabase/supabase-js"
import * as ImagePicker from "expo-image-picker"
import { v4 as uuidv4 } from "uuid"
import { Buffer } from "buffer"

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

async function uploadImage(supabase: SupabaseClient, base64: string, filename: string) {
  const { data, error } = await supabase.storage
    .from("media")
    .upload(filename, Buffer.from(base64, "base64"), {
      contentType: "image/jpeg",
      upsert: true,
    })
  if (error) {
    console.log("Error uploading file: ", error.message)
    alert("Error uploading file")
    return
  }
  console.log("Success uploading file: ", data)
}

async function createMedia(supabase: SupabaseClient, medias: MediaCreate[]) {
  const { data, error } = await supabase.from("media").insert(medias)
  if (error) {
    console.log("Error inserting media: ", error.message)
    alert("Error inserting media")
    return
  }
  console.log("Success inserting media: ", data)
}

export const AlbumScreen: FC<AlbumScreenProps> = observer(function AlbumScreen(_props) {
  const { mediaStore } = useStores()
  const albumId = _props.route.params.albumId
  const [medias, setMedias] = React.useState<Media[]>([])
  const [direction, setDirection] = React.useState("")
  const [swipedDirection, setSwipedDirection] = React.useState("")
  const [intensity, setIntensity] = React.useState(10)
  const [showingHeart, setShowingHeart] = React.useState(false)
  const [heartScale, setHeartScale] = React.useState(new Animated.Value(0))
  const [thumb, setThumb] = React.useState(false)
  const [sad, setSad] = React.useState(false)
  const [smile, setSmile] = React.useState(false)
  const [angry, setAngry] = React.useState(false)
  const [modalVisible, setModalVisible] = React.useState(false)

  const [selectedImages, setSelectedImages] = React.useState<string[]>([])

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
      setMedias(mediaStore.medias)
    })
  }, [albumId])

  function onSwipe(direction: string) {
    setDirection(direction)
    if (direction === "right") {
      setShowingHeart(true)
      animateHeart()
      setTimeout(() => {
        setShowingHeart(false)
        heartScale.setValue(0) // Reset the animation
      }, 1000)
    }
    setThumb(false)
    setSad(false)
    setSmile(false)
    setAngry(false)
  }

  function onCardLeftScreen(myIdentifier: string) {
    setSwipedDirection(direction)
    setMedias((prev) => {
      return prev.filter((media) => media.id !== myIdentifier)
    })
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

  function handleToggleReaction(reaction: string) {
    if (reaction === "thumb") {
      setThumb(!thumb)
    } else if (reaction === "sad") {
      setSad(!sad)
    } else if (reaction === "smile") {
      setSmile(!smile)
    } else if (reaction === "angry") {
      setAngry(!angry)
    }
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

  async function handleUploadToAlbum() {
    if (selectedImages.length === 0) {
      alert("No image selected")
      return
    }
    const userId = await getUserId()
    if (!userId) {
      alert("User not found")
      return
    }
    const mediaCreates: MediaCreate[] = selectedImages.map(() => {
      const uuid = uuidv4()
      return {
        id: uuid,
        title: "No title",
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
  }

  return (
    <Screen style={$root}>
      <GoBackButton goBack={goBack}>{/* <Text text="< Go Back" /> */}</GoBackButton>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: "absolute",
          right: 20,
          top: 10,
        }}
      >
        <Icon icon="upload" size={24} />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
                <Text text="Selected Images:" />
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
            <Button onPress={handleUploadImage} preset="filled">
              Select
            </Button>
            <Button onPress={handleUploadToAlbum} preset="reversed">
              Upload
            </Button>
          </View>
        </View>
      </Modal>
      <View style={$screen}>
        <BlurView intensity={intensity} style={[$backdrop, { zIndex: intensity < 2 ? -1 : 10 }]} />
        {medias.length !== 0 && (
          <View style={$container}>
            {/* <Text tx="albumScreen.swipeHint" style={{color: colors.text, alignSelf: "center"}} /> */}
            {medias.map((media) => (
              <TinderCard
                key={media.id}
                onSwipe={onSwipe}
                onCardLeftScreen={() => onCardLeftScreen(media.id)}
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
                        : "No title") as string
                    }
                  />

                  <Text
                    style={$description}
                    text={
                      "created at: " +
                      new Date(medias[medias.length - 1].created_at).toLocaleDateString()
                    }
                  />

                  <Text
                    style={$description}
                    text={"uploaded by: " + medias[medias.length - 1].uploader?.username}
                  />
                  <Text
                    style={$description}
                    text={"hashtags: " + medias[medias.length - 1].hashtag?.join(", ")}
                  />
                </>
              }
            />
            <View style={$reactCard}>
              {/* <Text tx="albumScreen.reactionHint" /> */}
              <View style={$icons}>
                <TouchableOpacity onPress={() => handleToggleReaction("thumb")}>
                  <Icon
                    icon="thumb"
                    size={30}
                    color={thumb ? colors.tint : "black"}
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
            </View>
          </View>
        )}
        <ScrollView style={$galleryContainer}>
          {mediaStore.medias && <Gallery medias={mediaStore.medias} />}
        </ScrollView>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  display: "flex",
  paddingTop: 80,
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
  height: 100,
  width: "100%",
  flex: 1,
  alignItems: "center",
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
