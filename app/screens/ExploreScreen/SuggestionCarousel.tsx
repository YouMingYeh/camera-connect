import * as React from "react"
import { Dimensions, View } from "react-native"

import SBImageItem from "./SBImageItem"
import Carousel from "react-native-reanimated-carousel"
import { fetchRandomMedia } from "./fetchRandomMedia"
import { MediaItem } from "./types"
export const renderItem = (index: number, item: MediaItem, userId: string) => (
  <SBImageItem
    key={index}
    index={index}
    style={{ borderRadius: 0 }}
    img={{ uri: item.url }}
    media={item}
  />
)
function Index({ userId }: { userId: string }) {
  const width = Dimensions.get("window").width
  const [entries, setEntries] = React.useState<MediaItem[]>([])
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
        renderItem={({ item, index }) => renderItem(index, item, userId)}
      />
    </View>
  )
}

export default Index
