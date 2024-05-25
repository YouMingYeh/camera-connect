/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from "react-native"
import React, { useEffect, useState } from "react"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Media } from "./type"
import { ResizeMode, Video } from "expo-av"
import { ImageEditor } from "./expo-image-editor"
import VideoTrimmer from "./VideoTrimmer"
import { Picker } from "@react-native-picker/picker"
import { Button, Card } from "app/components"
import { useStores } from "app/models"
import { getUserId, supabase } from "app/utils/supabase"
import { SupabaseClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"
import { Buffer } from "buffer"
import * as ImageManinpulator from "expo-image-manipulator"
import { AppStackParamList } from "app/navigators"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type MediaCreate = {
  id: string
  title: string
  is_video: boolean
  url: string
  album_id: string
  uploader_id: string
  hashtag: string[]
}

async function uploadImage(supabase: SupabaseClient, base64: string, filename: string) {
  const { data, error } = await supabase.storage
    .from("media")
    .upload(filename, Buffer.from(base64, "base64"), {
      contentType: "image/jpeg",
      upsert: true,
    })
  if (error) {
    console.log("Error uploading file: ", error.message)
    Alert.alert("出錯了！", "上傳檔案失敗...")
    return
  }
  console.log("Success uploading file: ", data)
}

async function createMedia(supabase: SupabaseClient, medias: MediaCreate[]) {
  const { data, error } = await supabase.from("media").insert(medias)
  if (error) {
    console.log("Error inserting media: ", error.message)
    Alert.alert("出錯了！", "上傳檔案失敗...")
    return
  }
  console.log("Success inserting media: ", data)
}

const CameraPreview = ({
  medias,
  setMedias,
  retakePicture,
  navigation,
}: {
  medias: Media[]
  setMedias: (medias: Media[]) => void
  retakePicture: () => void
  navigation: NativeStackNavigationProp<AppStackParamList, "Camera", undefined>
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [selectedPhotos, setSelectedPhotos] = useState<Array<boolean>>(
    new Array(medias.length).fill(false),
  )
  const [editorVisible, setEditorVisible] = useState(false)
  const [videoEditorVisible, setVideoEditorVisible] = useState(false)
  const photo = medias[selectedPhotoIndex]
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>()
  const [modelVisible, setModelVisible] = useState(false)
  const { joinAlbumStore, mediaStore } = useStores()

  const selectPhoto = (index: number) => {
    setSelectedPhotoIndex(index)
  }

  const toggleSelection = (index: number) => {
    const newSelectedPhotos = [...selectedPhotos]
    newSelectedPhotos[index] = !newSelectedPhotos[index]
    setSelectedPhotos(newSelectedPhotos)
  }
  const handleEdit = () => {
    if (photo && photo.type === "video") {
      setVideoEditorVisible(true)
      return
    }
    setEditorVisible(true)
  }

  async function handleUploadToAlbum() {
    if (selectedPhotos.length === 0) {
      Alert.alert("出錯了！", "你沒有選擇照片")
      return
    }
    const userId = await getUserId()
    if (!userId) {
      Alert.alert("出錯了！", "找不到使用者")
      return
    }
    if (!selectedAlbum) {
      Alert.alert("出錯了！", "請選擇一個相簿")
      return
    }
    const mediasToUpload = medias.filter((_, index) => selectedPhotos[index])

    const mediaCreates: MediaCreate[] = mediasToUpload.map(() => {
      const uuid = uuidv4()
      return {
        id: uuid,
        title: "沒有標題",
        is_video: false,
        url:
          "https://adjixakqimigxsubirmn.supabase.co/storage/v1/object/public/media/media-" + uuid,
        album_id: selectedAlbum,
        uploader_id: userId,
        hashtag: [],
      }
    })

    for (let i = 0; i < mediasToUpload.length; i++) {
      const base64 = await ImageManinpulator.manipulateAsync(mediasToUpload[i].data.uri, [], {
        compress: 1,
        format: ImageManinpulator.SaveFormat.JPEG,
        base64: true,
      })
      if (!base64) {
        Alert.alert("出錯了！", "壓縮照片失敗...")
        return
      }
      // const base64 = medias[i].data.uri
      await uploadImage(supabase, base64.base64, "media-" + mediaCreates[i].id)
    }

    await createMedia(supabase, mediaCreates)
    await mediaStore.fetchMedias(supabase, userId)
    setModelVisible(false)
    Alert.alert("成功了！", "照片已經上傳到相簿，快去看看吧！")
    const selectedAlbumName = joinAlbumStore.joinAlbums.find(
      (album) => album.album.id === selectedAlbum,
    )?.album.album_name
    navigation.navigate("Album", { albumId: selectedAlbum, albumName: selectedAlbumName })
  }

  const fetchJoinAlbums = async () => {
    const userId = await getUserId()
    if (!userId) {
      return
    }
    joinAlbumStore.fetchJoinAlbums(supabase, userId)
    setSelectedAlbum(joinAlbumStore.joinAlbums[0]?.album.id)
  }

  useEffect(() => {
    fetchJoinAlbums()
  }, [])

  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <Modal transparent visible={modelVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Card
            style={{
              width: "90%",
            }}
            ContentComponent={
              <>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  選擇上傳的相簿：
                </Text>
                <Picker
                  style={{
                    backgroundColor: "white",
                    width: "100%",
                  }}
                  selectedValue={selectedAlbum}
                  onValueChange={(itemValue) => setSelectedAlbum(itemValue)}
                >
                  {joinAlbumStore?.joinAlbums.map((album) => (
                    <Picker.Item
                      key={album.album.id}
                      label={album.album.album_name}
                      value={album.album.id}
                    />
                  ))}
                </Picker>
              </>
            }
          ></Card>
          <View
            style={{
              flexDirection: "row",
              width: "90%",
              marginTop: 10,
              gap: 10,
            }}
          >
            <Button
              style={{
                flex: 1,
              }}
              onPress={() => setModelVisible(false)}
            >
              取消
            </Button>
            <Button
              style={{
                flex: 1,
              }}
              onPress={handleUploadToAlbum}
              preset={"reversed"}
            >
              上傳
            </Button>
          </View>
        </View>
      </Modal>

      <Button
        onPress={retakePicture}
        style={{
          position: "absolute",
          left: 20,
          top: 50,
          zIndex: 10,
          padding: 10,
        }}
      >
        繼續拍攝
      </Button>

      <Button
        style={{
          position: "absolute",
          right: 20,
          top: 50,
          zIndex: 10,
          padding: 10,
        }}
        onPress={() => {
          setMedias([])
          retakePicture()
        }}
      >
        重新拍攝
      </Button>
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
        videoEditorVisible ? (
          <VideoTrimmer videoUri={photo && photo.data.uri} />
        ) : (
          <Video
            source={{ uri: photo && photo.data.uri }}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
          />
        )
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
      {(editorVisible || videoEditorVisible) && (
        <TouchableOpacity
          onPress={() => {
            setEditorVisible(false)
            setVideoEditorVisible(false)
          }}
          style={{
            position: "absolute",
            left: 20,
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
            離開編輯
          </Text>
        </TouchableOpacity>
      )}

      <View
        style={{
          flex: 1,
          flexDirection: "column",
          padding: 10,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            position: "absolute",
            right: 10,
            bottom: 120,
            width: "100%",
            zIndex: 10,
          }}
        >
          <Button
            onPress={() => handleEdit()}
            style={{
              paddingEnd: 10,
              alignItems: "center",
              borderRadius: 4,
            }}
          >
            編輯
          </Button>

          <Button
            onPress={() => {
              // check if any true in selectedPhotos array
              if (selectedPhotos.includes(true)) {
                setModelVisible(true)
              } else {
                Alert.alert("出錯了！", "你沒有選擇照片")
              }
            }}
            style={{
              paddingEnd: 10,
              alignItems: "center",
              borderRadius: 4,
            }}
          >
            儲存
          </Button>
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
    zIndex: 20,
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
    zIndex: 50,
  },
  thumbnailScrollView: {
    bottom: 0,
    height: 100,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 10,
  },
})

export default CameraPreview
