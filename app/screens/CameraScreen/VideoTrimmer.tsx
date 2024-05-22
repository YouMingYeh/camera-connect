import React, { useState, useRef, useEffect } from "react"
import { View, StyleSheet } from "react-native"
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av"
import MultiSlider from "@ptomasroos/react-native-multi-slider"

const VideoTrimmer = ({ videoUri }: { videoUri: string }) => {
  const videoRef = useRef<Video>(null)
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | null>(null)
  const [sliderValues, setSliderValues] = useState([0.1, 99.0])
  const startTrim = sliderValues[0]
  const endTrim = sliderValues[1]

  //   const handlePlaySegment = async (): Promise<void> => {
  //     if (videoRef.current) {
  //       const status = await videoRef.current.getStatusAsync()
  //       if (status.isLoaded) {
  //         videoRef.current.setPositionAsync(playbackStatus.durationMillis*startTrim/100) // start position in milliseconds
  //         videoRef.current.playAsync()
  //       }
  //     }
  //   }

  const handleStatusUpdate = async (status: AVPlaybackStatus) => {
    setPlaybackStatus(status)
    // handlePlaySegment()
    // @ts-expect-error
    if (status.isLoaded && status.positionMillis >= (status.durationMillis * endTrim) / 100) {
      await videoRef.current?.pauseAsync()
      //   await handlePlaySegment()
    }
  }

  useEffect(() => {
    const handlePlaySegment = async (): Promise<void> => {
      if (videoRef.current) {
        const status = await videoRef.current.getStatusAsync()
        if (status.isLoaded) {
          if (playbackStatus) {
            // @ts-expect-error
            videoRef.current.setPositionAsync((playbackStatus.durationMillis * startTrim) / 100) // start position in milliseconds
          }
          videoRef.current.replayAsync()
        }
      }
    }

    handlePlaySegment()
  }, [startTrim, endTrim])

  return (
    <>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: videoUri }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        // positionMillis={playbackStatus ? playbackStatus.durationMillis*startTrim/100 : 0}
        onPlaybackStatusUpdate={handleStatusUpdate}
      />
      <View style={styles.controls}>
        <MultiSlider
          unselectedStyle={{}}
          // eslint-disable-next-line react-native/no-inline-styles
          markerStyle={{ width: 2 }}
          values={[sliderValues[0], sliderValues[1]]}
          sliderLength={280}
          onValuesChange={setSliderValues}
          min={0}
          max={100}
          step={1}
          allowOverlap={false}
          snapped
          minMarkerOverlapDistance={10}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  container: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "center",
    width: "100%",
    zIndex: -10,
  },
  // eslint-disable-next-line react-native/no-color-literals
  controls: {
    alignItems: "center",
    bottom: 200,
    color: "white",
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    zIndex: 10,
  },
  video: {
    height: "100%",
    position: "absolute",
    top: 0,
    width: "100%",
  },
})

export default VideoTrimmer
