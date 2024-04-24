/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { CameraCapturedPicture } from "expo-camera"
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native"
import React, { useState } from "react"
import BouncyCheckbox from "react-native-bouncy-checkbox";

const CameraPreview = ({
  photos,
  retakePicture,
  savePhoto,
}: {
  photos: CameraCapturedPicture[]
  retakePicture: () => void
  savePhoto: () => void
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [selectedPhotos, setSelectedPhotos] = useState<Array<boolean>>(new Array(photos.length).fill(false))
  const photo = photos[selectedPhotoIndex]

  const selectPhoto = (index: number) => {
    setSelectedPhotoIndex(index)
  }

  const toggleSelection = (index: number) => {
    const newSelectedPhotos = [...selectedPhotos]
    newSelectedPhotos[index] = !newSelectedPhotos[index]
    setSelectedPhotos(newSelectedPhotos)
  }

  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            padding: 15,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              position: "absolute",
              right: 0,
              bottom: 0,
              width: "100%",
              zIndex: 10,
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,
                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,
                alignItems: "center",
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              >
                save photo
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal={true}
            style={styles.thumbnailScrollView}
          >
            {photos.map((photo, index) => (
              <TouchableOpacity style={styles.thumbnailContainer} key={index} onPress={() => selectPhoto(index)}>
                <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
                <BouncyCheckbox
                  style={styles.checkboxContainer}
                  isChecked={selectedPhotos[index]}
                  onPress={() => toggleSelection(index)}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  checkboxContainer: {
    position: 'absolute',
    right: -14,
    top: 2,
  },
  thumbnail: {
    height: "100%",
    width: "100%",
  },
  thumbnailContainer: {
    borderBlockColor: "black",
    borderWidth: 1,
    height: 100,
    width: 100,
  },
  thumbnailScrollView: {
    bottom: 0,
    height: 100,
    left: 0,
    position: 'absolute',
    right: 0,
  },
})

export default CameraPreview