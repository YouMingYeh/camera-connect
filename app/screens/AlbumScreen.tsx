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
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Card, Icon, Screen, Text } from "app/components"
import { useStores } from "app/models"
import { supabase } from "app/utils/supabase"
import TinderCard from "react-tinder-card"
import { Media } from "app/models/Media"
import Gallery from "app/components/Gallery"
import { ScrollView } from "react-native-gesture-handler"
import { BlurView } from "expo-blur"
import { colors } from "app/theme"
import { GoBackButton } from "app/components/GoBackButton"

interface AlbumScreenProps extends AppStackScreenProps<"Album"> {}

export const AlbumScreen: FC<AlbumScreenProps> = observer(function AlbumScreen(_props) {
  const { mediaStore, authenticationStore } = useStores()
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
      }, 50)
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

  return (
    <Screen style={$root}>
      <GoBackButton goBack={goBack}>
        {/* <Text text="< Go Back" /> */}
      </GoBackButton>
      <View style={$screen}>
        
        <BlurView intensity={intensity} style={[$backdrop, { zIndex: intensity < 10 ? -1 : 10 }]} />
        {medias.length !== 0 && (
          <View style={$container}>
            <Text text="Swipe left or right" style={{color: colors.text, alignSelf: "center"}} />
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
              <Text text="What are you thinking?" />
              <View style={$icons}>
                <TouchableOpacity onPress={() => handleToggleReaction("thumb")}>
                  <Icon
                    icon="thumb"
                    size={30}
                    color={thumb ? colors.tint : "black"}
                    label="thumb"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggleReaction("sad")}>
                  <Icon icon="sad" size={30} color={sad ? colors.tint : "black"} label="sad" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggleReaction("smile")}>
                  <Icon
                    icon="heart"
                    size={30}
                    color={smile ? colors.tint : "black"}
                    label="smile"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggleReaction("angry")}>
                  <Icon
                    icon="angry"
                    size={30}
                    color={angry ? colors.tint : "black"}
                    label="angry"
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
}

const $image: ImageStyle = {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
  borderRadius: 20,
  zIndex: 100,
}
