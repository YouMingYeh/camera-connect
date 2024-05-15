import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { useStores } from "app/models"
import { getUserId, supabase } from "app/utils/supabase"
import TinderCard from "react-tinder-card"
import { Media } from "app/models/Media"
import AwesomeGallery, { RenderItemInfo } from "react-native-awesome-gallery"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface AlbumScreenProps extends AppStackScreenProps<"Album"> {}

export const AlbumScreen: FC<AlbumScreenProps> = observer(function AlbumScreen(_props) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const { mediaStore, authenticationStore } = useStores()
  const albumId = _props.route.params.albumId
  const [medias, setMedias] = React.useState<Media[]>([])
  const [direction, setDirection] = React.useState("")
  const [swipedDirection, setSwipedDirection] = React.useState("")

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

  // Pull in navigation via hook
  // const navigation = useNavigation()

  function onSwipe(direction: string) {
    setDirection(direction)
  }

  function onCardLeftScreen(myIdentifier: string) {
    setSwipedDirection(direction)
    setMedias((prev) => {
      return prev.filter((media) => media.id !== myIdentifier)
    })
  }

  const renderItem = ({
    item
  }: RenderItemInfo<{ uri: string }>) => {
    console.log(item.uri)
    return (
      <Image
      key={item.uri}
        source={{ uri: item.uri }}
        style={StyleSheet.absoluteFillObject}
      />
    );
  };

  return (
    <Screen style={$root} preset="scroll">
      <Button text="Go back" onPress={goBack} />
      <Text text="Swipe to like" style={$text} />
      
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
      </View>
      <AwesomeGallery
        data={medias.map((media) => ({ uri: media.url  }))}
        keyExtractor={(item) => item.uri}
        renderItem={renderItem}
        doubleTapInterval={150}
        onSwipeToClose={goBack}
        loop
        onScaleEnd={(scale) => {
          if (scale < 0.8) {
            goBack();
          }
        }}
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  display: "flex",
  paddingTop: 80,
  flexDirection: "column",
}

const $text: TextStyle = {
  textAlign: "center",
  fontSize: 40,
  fontWeight: "bold",
  padding: 20,
}

const $container: ViewStyle = {
  width: "100%",
  height: 500,
  display: "flex",
  padding: 20,
}

const $imageContainer: ViewStyle = {
  position: "absolute",
  width: "100%",
  height: 300,
  shadowColor: "black",
  shadowOpacity: 0.2,
  shadowRadius: 20,
}

const $image: ImageStyle = { width: "100%", height: "100%", resizeMode: "cover", borderRadius: 20 }
