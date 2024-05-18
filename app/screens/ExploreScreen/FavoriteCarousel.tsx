import * as React from "react"
import { StyleSheet, ActivityIndicator, Dimensions, View } from "react-native"

import type { StyleProp, ViewStyle, ImageURISource, ImageSourcePropType } from "react-native"

import { Image } from "expo-image"

import { interpolate } from "react-native-reanimated"
import Carousel from "react-native-reanimated-carousel"
import type { ScaledSize } from "react-native"

export const window: ScaledSize = Dimensions.get("window")
const scale = 0.7
const PAGE_WIDTH = window.width * scale
const PAGE_HEIGHT = 240 * scale

function Index() {
  const animationStyle = React.useCallback((value: number) => {
    "worklet"

    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30])
    const rotateZ = `${interpolate(value, [-1, 0, 1], [-20, 0, 20])}deg`
    const translateX = interpolate(value, [-1, 0, 1], [-window.width * 0.7, 0, window.width * 0.7])

    return {
      transform: [{ rotateZ }, { translateX }],
      zIndex,
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        style={{
          width: window.width,
          height: 400,
          justifyContent: "center",
        }}
        width={PAGE_WIDTH}
        height={PAGE_HEIGHT}
        data={[...new Array(16).keys()]}
        renderItem={({ index }) => {
          return <SBImageItem key={index} index={index} />
        }}
        customAnimation={animationStyle}
        autoPlay={true}
        scrollAnimationDuration={1500}
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
  const source = React.useRef<ImageURISource>({
    uri: `https://picsum.photos/id/${index}/400/300`,
  }).current

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="small" />
      <Image cachePolicy={"memory-disk"} key={index} style={styles.image} source={img ?? source} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
