import * as React from "react"
import { Dimensions, View } from "react-native"

import type { ImageSourcePropType } from "react-native"
import SBImageItem from "./SBImageItem"
import { interpolate } from "react-native-reanimated"
import Carousel from "react-native-reanimated-carousel"
import type { ScaledSize } from "react-native"

import { fetchRandomMedia } from "./fetchRandomMedia"
import { MediaItem } from "./types"
export const window: ScaledSize = Dimensions.get("window")
const scale = 0.7
const PAGE_WIDTH = window.width * scale
const PAGE_HEIGHT = 240 * scale

function Index({ userId }: { userId: string }) {
  const [entries, setEntries] = React.useState<MediaItem[]>([])
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

  React.useEffect(() => {
    const fetchData = async () => {
      const mediaEntries = await fetchRandomMedia(userId)
      setEntries(mediaEntries)
    }
    if (userId) fetchData()
  }, [userId])

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
        data={entries}
        renderItem={({ item, index }) => {
          return (
            <SBImageItem
              key={index}
              index={index}
              img={item.url as ImageSourcePropType}
              media={item}
            />
          )
        }}
        customAnimation={animationStyle}
        autoPlay={true}
        scrollAnimationDuration={1500}
      />
    </View>
  )
}

export default Index
