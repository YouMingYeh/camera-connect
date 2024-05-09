/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { StatusBar } from "expo-status-bar"
import {
  Camera,
  FlashMode,
  CameraType,
  CameraCapturedPicture,
} from "expo-camera/legacy"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, Linking } from "react-native"
import CameraPreview from "./CameraPreview"
import { ScrollView } from "react-native-gesture-handler"
import { Media, VideoType } from "./type"
import { ResizeMode, Video } from "expo-av"
import * as ImageManinpulator from "expo-image-manipulator"
import { supabase, get_userid } from "../../utils/supabase"
import { checkFriendshipStatus } from "../../screens/ProfileScreen/Friends"
let camera: Camera
interface BarCodeEvent {
  type: string
  data: string
}
export default function App() {
  const [startCamera, setStartCamera] = React.useState(false)
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedMedia, setCapturedMedias] = React.useState<Media[]>()
  const [cameraType, setCameraType] = React.useState(CameraType.back)
  const [flashMode, setFlashMode] = React.useState(FlashMode.off)
  const [recording, setRecording] = React.useState(false)
  const [userID, setUserID] = useState("")
  const [recordingMode, setRecordingMode] = React.useState(false)
  const [isProcessingScan, setIsProcessingScan] = useState(false)

  const __startCamera = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync()
    const audioStatus = await Camera.requestMicrophonePermissionsAsync()
    if (cameraStatus.status === "granted" && audioStatus.status === "granted") {
      setStartCamera(true)
    } else {
      Alert.alert("Access denied")
    }
  }

  const __toggleRecordingMode = () => {
    setRecordingMode((prevMode) => !prevMode)
  }

  const __takePicture = async () => {
    const photo: CameraCapturedPicture = await camera.takePictureAsync()

    // Make the image size smaller using expo image manipulator
    const manipResult = await ImageManinpulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 360 } }],
      {
        compress: 0.8,
        format: ImageManinpulator.SaveFormat.PNG,
      },
    )

    const media: Media = {
      type: "image",
      data: manipResult,
    }
    setCapturedMedias((prev) => {
      if (prev) {
        return [media, ...prev]
      } else {
        return [media]
      }
    })
  }

  const __takeVideo = async () => {
    setRecording(true)
    const video: VideoType = await camera.recordAsync()
    const media: Media = {
      type: "video",
      data: video,
    }
    setCapturedMedias((prev) => {
      if (prev) {
        return [media, ...prev]
      } else {
        return [media]
      }
    })
  }

  const __stopVideo = async () => {
    await camera.stopRecording()
    setRecording(false)
  }

  const __toggleRecord = async () => {
    if (recording) {
      await __stopVideo()
    } else {
      await __takeVideo()
    }
  }

  const __savePhoto = () => {
    if (!capturedMedia) {
      // return
    }
  }
  const __retakePicture = () => {
    setPreviewVisible(false)
    __startCamera()
  }
  const __handleFlashMode = () => {
    if (flashMode === FlashMode.on) {
      setFlashMode(FlashMode.off)
    } else if (flashMode === FlashMode.off) {
      setFlashMode(FlashMode.on)
    } else {
      setFlashMode(FlashMode.auto)
    }
  }
  const __switchCamera = () => {
    if (cameraType === CameraType.back) {
      setCameraType(CameraType.front)
    } else {
      setCameraType(CameraType.back)
    }
  }

  const __handlePreviewButtonPress = () => {
    setPreviewVisible(true)
  }

  const __handleBarCodeScanned = async ({ type, data }: BarCodeEvent) => {
    if (isProcessingScan) return
    setIsProcessingScan(true)

    try {
      let payload
      try {
        payload = JSON.parse(data)
        if (payload.type) {
          switch (payload.type) {
            case "friendRequest":
              await __handleFriendRequest(payload.data)
              break
            case "joinAlbum":
              await __joinAlbum(payload.data)
              break
            default:
              __handleDefaultQRAction(data)
              break
          }
        } else {
          __handleDefaultQRAction(data)
        }
      } catch (jsonError) {
        __handleDefaultQRAction(data)
      }
    } catch (error) {
      console.error("Error processing QR code:", error)
      Alert.alert("Error", "Failed to process QR code")
    }

    setTimeout(() => {
      setIsProcessingScan(false)
    }, 3000)
  }

  const __handleDefaultQRAction = (data: string) => {
    if (/^https?:\/\//.test(data)) {
      Alert.alert(
        "Open Link",
        "Do you want to open this link?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open", onPress: () => Linking.openURL(data) },
        ],
        { cancelable: false },
      )
    } else {
      Alert.alert("Unrecognized QR Code", "The scanned code is not recognized.")
    }
  }

  const __handleFriendRequest = async (userID: string) => {
    const currentUserID = await get_userid()
    if (!currentUserID) {
      Alert.alert("Error", "User not logged in")
      return
    }

    if (currentUserID === userID) {
      Alert.alert("Error", "You cannot add yourself as a friend.")
      return
    }

    const isAlreadyFriend = await checkFriendshipStatus(currentUserID, userID)
    if (isAlreadyFriend) {
      Alert.alert("Friendship Status", "You are already friends!")
    } else {
      Alert.alert("Add Friend", "Do you want to add this user as a friend?", [
        { text: "Cancel", style: "cancel" },
        { text: "Add", onPress: () => __addFriend(currentUserID) },
      ])
    }
  }
  const __addFriend = async (scannedUserID: string) => {
    try {
      const { data, error } = await supabase
        .from("friends_with")
        .insert([{ sender_id: userID, receiver_id: scannedUserID }])

      if (error) throw new Error(error.message)

      console.log("Friend added:", data)
      Alert.alert("Success", "Friend added successfully!")
    } catch (err) {
      console.error("Failed to add friend:", err)
      Alert.alert("Error", "Failed to add friend")
    }
  }
  const __joinAlbum = async (albumId: string) => {
    const userID = await get_userid()
    if (!userID) {
      Alert.alert("Error", "User not logged in")
      return
    }

    try {
      const { data: existingEntries, error: existingError } = await supabase
        .from("join_album")
        .select("*")
        .eq("user_id", userID)
        .eq("album_id", albumId)

      if (existingError) throw existingError

      if (existingEntries.length > 0) {
        Alert.alert("Album Membership", "You are already a member of this album.")
        return
      }
    } catch (error) {
      console.error("Error checking album membership:", error)
      Alert.alert("Error", "Failed to check album membership")
      return
    }

    try {
      const { data, error } = await supabase
        .from("join_album")
        .insert([{ user_id: userID, album_id: albumId }])

      if (error) throw new Error(error.message)

      Alert.alert("Success", "You have joined the album successfully!")
    } catch (err) {
      console.error("Failed to join album:", err)
      Alert.alert("Error", "Failed to join album")
    }
  }

  useEffect(() => {
    const fetchAndSetUserID = async () => {
      const fetchedUserID = await get_userid()
      if (fetchedUserID && fetchedUserID !== "") {
        setUserID(fetchedUserID)
      }
    }

    fetchAndSetUserID()
  }, [])

  useEffect(() => {
    __startCamera()
  }, [])

  const [customAutoFocus, setCustomAutoFocus] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (customAutoFocus) {
        setCustomAutoFocus(false)
      } else {
        setCustomAutoFocus(true)
      }
    }, 1000)
    return () => clearInterval(interval)
  })

  return (
    <View style={styles.container}>
      {startCamera ? (
        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          {previewVisible && capturedMedia ? (
            <CameraPreview
              medias={capturedMedia}
              savePhoto={__savePhoto}
              retakePicture={__retakePicture}
              setMedias={setCapturedMedias}
            />
          ) : (
            <Camera
              type={cameraType}
              flashMode={flashMode}
              style={{ flex: 1 }}
              ref={(r) => {
                camera = r as Camera
              }}
              useCamera2Api={true}
              autoFocus={customAutoFocus}
              onBarCodeScanned={__handleBarCodeScanned}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  backgroundColor: "transparent",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    left: "5%",
                    top: "10%",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={__handleFlashMode}
                    style={{
                      borderRadius: 50, // Change the value to a number
                      height: 35,
                      width: 35,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 30,
                      }}
                    >
                      {flashMode === FlashMode.on
                        ? "⚡️"
                        : flashMode === FlashMode.off
                        ? "🔆"
                        : "❌"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={__switchCamera}
                    style={{
                      marginTop: 10,
                      borderRadius: 50,
                      height: 35,
                      width: 35,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 30,
                      }}
                    >
                      {cameraType === CameraType.front ? "🤳" : "📸"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={__toggleRecordingMode}
                    style={{
                      marginTop: 10,
                      borderRadius: 50,
                      height: 35,
                      width: 35,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 30,
                      }}
                    >
                      {recordingMode ? "📹" : "📷"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    flexDirection: "row",
                    flex: 1,
                    width: "100%",
                    padding: 20,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      alignSelf: "center",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={recordingMode ? __toggleRecord : __takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: recordingMode ? "#ff0000" : "#fff",
                        zIndex: 10,
                        borderWidth: 3,
                        borderColor: recording ? "#ff0000" : "#fff",
                      }}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={__handlePreviewButtonPress}
                style={{
                  position: "absolute",
                  right: 20,
                  bottom: 20,
                  borderRadius: 30,
                  width: 60,
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {capturedMedia && capturedMedia.length > 0 && (
                  <ScrollView horizontal={true} style={styles.thumbnailScrollView}>
                    {capturedMedia.map((media) =>
                      media.type === "image" ? (
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
                      ),
                    )}
                  </ScrollView>
                )}
              </TouchableOpacity>
            </Camera>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={__startCamera}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Take picture
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  thumbnail: {
    height: 80,
    width: 80,
  },
  thumbnailScrollView: {
    backgroundColor: "transparent",
    width: "100%",
  },
})
