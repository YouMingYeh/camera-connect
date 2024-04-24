/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { StatusBar } from "expo-status-bar"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image } from "react-native"
import { Camera, FlashMode, CameraType, CameraCapturedPicture } from "expo-camera"
import CameraPreview from "./CameraPreview"
import { ScrollView } from "react-native-gesture-handler"
let camera: Camera
export default function App() {
  const [startCamera, setStartCamera] = React.useState(false)
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImages, setCapturedImages] = React.useState<CameraCapturedPicture[]>()
  const [cameraType, setCameraType] = React.useState(CameraType.back)
  const [flashMode, setFlashMode] = React.useState(FlashMode.off)

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    if (status === "granted") {
      setStartCamera(true)
    } else {
      Alert.alert("Access denied")
    }
  }
  const __takePicture = async () => {
    const photo: CameraCapturedPicture = await camera.takePictureAsync()
    // setPreviewVisible(true)
    setCapturedImages((prev) => {
      if (prev) {
        return [photo, ...prev]
      } else {
        return [photo]
      }
    })
  }
  const __savePhoto = () => {
    if (capturedImages) {
      console.log(capturedImages[0].uri)
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
          {previewVisible && capturedImages ? (
            <CameraPreview
              photos={capturedImages}
              savePhoto={__savePhoto}
              retakePicture={__retakePicture}
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
                      backgroundColor: flashMode === FlashMode.off ? "#000" : "#fff",
                      borderRadius: 50, // Change the value to a number
                      height: 25,
                      width: 25,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                      }}
                    >
                      ⚡️
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={__switchCamera}
                    style={{
                      marginTop: 20,
                      borderRadius: 50,
                      height: 25,
                      width: 25,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                      }}
                    >
                      {cameraType === CameraType.front ? "🤳" : "📷"}
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
                      onPress={__takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: "#fff",
                        zIndex: 10,
                      }}
                    />
                  </View>
                </View>
              </View>
              <View style={{ height: 80, width: "100%", backgroundColor: "transparent" }}>
                {capturedImages && capturedImages.length > 0 && (
                  <ScrollView horizontal={true} style={styles.thumbnailScrollView}>
                    {capturedImages.map((photo) => (
                      <Image key={photo.uri} source={{ uri: photo.uri }} style={styles.thumbnail} />
                    ))}
                  </ScrollView>
                )}
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
                  <Text style={{color: "white"}}>Preview</Text>
                </TouchableOpacity>
              </View>
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
