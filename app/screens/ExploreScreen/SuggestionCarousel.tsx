import * as React from "react"
import { StyleSheet, ActivityIndicator, Dimensions, View } from "react-native"

import type { StyleProp, ViewStyle, ImageSourcePropType } from "react-native"

import { Image } from "expo-image"

import Carousel from "react-native-reanimated-carousel"
import { fetchRandomMedia } from "./fetchRandomMedia"
import { MediaItem } from "./types"
export const renderItem = (index: number, item: MediaItem) => (
  <SBImageItem
    showIndex={false}
    key={index}
    index={index}
    style={{ borderRadius: 0 }}
    img={{ uri: item.url }}
  />
)
function Index() {
  const width = Dimensions.get("window").width
  const [entries, setEntries] = React.useState<MediaItem[]>([])
  React.useEffect(() => {
    const fetchData = async () => {
      const mediaEntries = await fetchRandomMedia()
      setEntries(mediaEntries)
    }
    fetchData()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        data={entries}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        scrollAnimationDuration={1500}
        renderItem={({ item, index }) => renderItem(index, item)}
      />
    </View>
  )
}

export default Index

interface Props {
  style?: StyleProp<ViewStyle>
  index?: number
  showIndex?: boolean
  img?: ImageSourcePropType
}

export const SBImageItem: React.FC<Props> = ({ style, index: _index, img }) => {
  const index = _index ?? 0
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="small" />
      <Image cachePolicy={"memory-disk"} key={index} style={styles.image} source={img} />
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
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
})
