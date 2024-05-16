/* eslint-disable react-native/no-inline-styles */
import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card, Screen, Text } from "app/components"
import { useStores } from "app/models"
import { supabase } from "app/utils/supabase"
import TinderCard from "react-tinder-card"
import { Media } from "app/models/Media"
import Gallery from "app/components/Gallery"
import { ScrollView } from "react-native-gesture-handler"
import { BlurView } from "expo-blur"

interface AlbumScreenProps extends AppStackScreenProps<"Album"> {}

export const AlbumScreen: FC<AlbumScreenProps> = observer(function AlbumScreen(_props) {
  const { mediaStore, authenticationStore } = useStores()
  const albumId = _props.route.params.albumId
  const [medias, setMedias] = React.useState<Media[]>([])
  const [direction, setDirection] = React.useState("")
  const [swipedDirection, setSwipedDirection] = React.useState("")
  const [intensity, setIntensity] = React.useState(10)

  if (!authenticationStore.isAuthenticated) {
    _props.navigation.navigate("Welcome")
  }

  function goBack() {
    _props.navigation.navigate("Welcome")
  }

  useEffect(() => {
    mediaStore.fetchMedias(supabase, albumId).then(() => {
      setMedias(mediaStore.medias)
    })
  }, [albumId])

  function onSwipe(direction: string) {
    setDirection(direction)
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

  return (
    <Screen style={$root}>
      <View style={$screen}>
        <Button text="Back" onPress={goBack} />
        <BlurView intensity={intensity} style={[$backdrop, { zIndex: intensity < 10 ? -1 : 10 }]} />
        {medias.length !== 0 && (
          <View style={$container}>
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
            ></Card>
          </View>
        )}
        <ScrollView style={$galleryContainer}>
          {mediaStore.medias && (
            <Gallery
              images={mediaStore.medias.map((media) => ({ id: media.id, url: media.url }))}
            />
          )}
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
  zIndex: 100,
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

const $image: ImageStyle = { width: "100%", height: "100%", resizeMode: "cover", borderRadius: 20 }
