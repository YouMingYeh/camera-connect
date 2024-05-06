import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import {
  View,
  ViewStyle,
  Dimensions,
  TextStyle,
  Image,
  TouchableOpacity,
  ImageStyle,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import Carousel from "react-native-reanimated-carousel"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"
import { DemoUseCase } from "./DemoShowroomScreen/DemoUseCase"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

// const deviceWidth = Dimensions.get('window').width

interface AlbumFeedScreenProps extends AppStackScreenProps<"AlbumFeed"> {}

type Data = {
  id: number
  title: string
  description: string
  image: string
}

export const AlbumFeedScreen: FC<AlbumFeedScreenProps> = observer(function AlbumScreen(_props) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const { navigation } = _props

  function goNext(albumId: string) {
    navigation.navigate("Album", { albumId: albumId })
  }

  const [currentIndex, setCurrentIndex] = React.useState(0)

  const width = Dimensions.get("window").width

  const data: Data[] = [
    {
      id: 1,
      title: "Title 1",
      description: "Description 1",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 2,
      title: "Title 2",
      description: "Description 2",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 3,
      title: "Title 3",
      description: "Description 3",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 4,
      title: "Title 4",
      description: "Description 4",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 5,
      title: "Title 5",
      description: "Description 5",
      image: "https://picsum.photos/200/300",
    },
  ]

  return (
    <Screen style={$root} preset="scroll">
      <DemoDivider size={50} />
      <DemoUseCase name="最近動態" description="你的相簿成員最近更新了這些照片！" layout="column">
        <Carousel
          loop
          mode="parallax"
          width={width * 0.9}
          style={$carousel}
          modeConfig={{
            parallaxScrollingScale: 0.8,
            parallaxScrollingOffset: 100,
          }}
          height={width / 2}
          data={data}
          scrollAnimationDuration={1000}
          onSnapToItem={setCurrentIndex}
          renderItem={({ item }) => (
            <View style={$item}>
              <Image source={{ uri: item.image }} style={$image} />
              {/* <Text style={$text}>{item.title}</Text> */}
            </View>
          )}
        />
        <Text style={$text}>{data[currentIndex].title}</Text>
        <Text style={$text}>{data[currentIndex].description}</Text>
      </DemoUseCase>

      <DemoDivider size={10} />
      <DemoUseCase name="你的相簿" description="你加入的相簿" layout="column">
        <Carousel
          loop
          mode="parallax"
          vertical
          width={width * 0.9}
          style={$carousel}
          modeConfig={{
            parallaxScrollingScale: 0.8,
            parallaxScrollingOffset: 100,
          }}
          height={width / 2}
          data={data}
          scrollAnimationDuration={1000}
          onSnapToItem={setCurrentIndex}
          renderItem={({ item }) => (
            <View style={$item}>
              {/* <Text style={$text}>{item.title}</Text> */}
              <TouchableOpacity onPress={() => goNext(item.id.toString())}>
                <Image source={{ uri: item.image }} style={$image} />
              </TouchableOpacity>
            </View>
          )}
        />
        <Text style={$text}>{data[currentIndex].title}</Text>
        <Text style={$text}>{data[currentIndex].description}</Text>
      </DemoUseCase>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  padding: 8,
  overflow: "scroll",
}

const $item: ViewStyle = {
  flex: 1,
  borderWidth: 1,
  justifyContent: "center",
}

const $text: TextStyle = { textAlign: "center" }

const $image: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $carousel: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
