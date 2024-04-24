/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { Text, TouchableOpacity, View, Image, StyleSheet, ScrollView } from "react-native"
import React, { useState } from "react"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Media } from "./type"
import { ResizeMode, Video } from "expo-av"
import { ImageEditor } from "./expo-image-editor"

const CameraPreview = ({
  medias,
  setMedias,
  retakePicture,
  savePhoto,
}: {
  medias: Media[]
  setMedias: (medias: Media[]) => void
  retakePicture: () => void
  savePhoto: () => void
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [selectedPhotos, setSelectedPhotos] = useState<Array<boolean>>(
    new Array(medias.length).fill(false),
  )
  const [editorVisible, setEditorVisible] = useState(false)
  const photo = medias[selectedPhotoIndex]

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
      <TouchableOpacity
        onPress={() => setEditorVisible(true)}
        style={{
          position: "absolute",
          right: 20,
          top: 30,
          zIndex: 10,
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 20,
          }}
        >
          Edit
        </Text>
      </TouchableOpacity>
      <ImageEditor
        visible={editorVisible}
        onCloseEditor={() => setEditorVisible(false)}
        imageUri={photo && photo.data.uri}
        minimumCropDimensions={{
          width: 100,
          height: 100,
        }}
        onEditingComplete={(result) => {
          const newMedias = [...medias]
          newMedias[selectedPhotoIndex] = {
            type: "image",
            data: {
              uri: result.uri,
            },
          }
          setMedias(newMedias)
          setEditorVisible(false)
        }}
        mode="full"
      />
      {photo && photo.type === "video" ? (
        <Video
          source={{ uri: photo.data.uri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        />
      ) : (
        <Image
          source={{ uri: photo && photo.data.uri }}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        />
      )}

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
            bottom: 120,
            width: "100%",
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            onPress={retakePicture}
            style={{
              paddingEnd: 10,
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
              paddingEnd: 20,
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
        <ScrollView horizontal={true} style={styles.thumbnailScrollView}>
          {medias.map((media, index) => (
            <TouchableOpacity
              style={styles.thumbnailContainer}
              key={index}
              onPress={() => selectPhoto(index)}
            >
              {media.type === "image" ? (
                <Image
                  key={media.data.uri}
                  source={{ uri: media.data.uri }}
                  style={styles.thumbnail}
                />
              ) : (
                <Video
                  key={media.data.uri}
                  source={{ uri: media.data.uri }}
                  style={styles.thumbnail}
                  resizeMode={ResizeMode.COVER}
                />
              )}

              <BouncyCheckbox
                style={styles.checkboxContainer}
                isChecked={selectedPhotos[index]}
                onPress={() => toggleSelection(index)}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  checkboxContainer: {
    position: "absolute",
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
    position: "absolute",
    right: 0,
  },
})

export default CameraPreview
