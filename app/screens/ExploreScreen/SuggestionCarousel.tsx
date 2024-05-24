import * as React from "react"
import { Dimensions, View, PanResponder } from "react-native"

import SBImageItem from "./SBImageItem"
import Carousel from "react-native-reanimated-carousel"
import { fetchRandomMedia } from "./fetchRandomMedia"
import { MediaItem } from "./types"

function Index({ userId }: { userId: string }) {
  const width = Dimensions.get("window").width
  const [entries, setEntries] = React.useState<MediaItem[]>([])
  const [isScrolling, setIsScrolling] = React.useState(false)
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 10
      },
      onPanResponderGrant: () => {
        setIsScrolling(true)
      },
      onPanResponderMove: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > 10) {
          setIsScrolling(true)
        }
      },
      onPanResponderRelease: () => {
        setIsScrolling(false)
      },
      onPanResponderTerminate: () => {
        setIsScrolling(false)
      },
    }),
  ).current
  React.useEffect(() => {
    const fetchData = async () => {
      const mediaEntries = await fetchRandomMedia(userId)
      setEntries(mediaEntries)
    }
    if (userId) fetchData()
  }, [userId])

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
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
        renderItem={({ item, index }) => {
          return (
            <SBImageItem
              key={index}
              index={index}
              img={item.url}
              media={item}
              userId={userId}
              isScrolling={isScrolling}
            />
          )
        }}
      />
    </View>
  )
}

export default Index
