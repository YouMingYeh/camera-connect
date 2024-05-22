/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-color-literals */
import React, { useState } from "react"
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native"
import { Icon } from "./Icon"
import { Media } from "app/models/Media"
import { Card } from "./Card"
import { Text } from "./Text"
import { colors } from "app/theme"

interface GalleryProps {
  medias: Media[]
}

export default function Gallery({ medias }: GalleryProps) {
  const [modalVisible, setModalVisible] = useState(false)
  // const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [modalOpacity] = useState(new Animated.Value(0))
  const [heart, setHeart] = useState(false)
  const [thumb, setThumb] = useState(false)
  const [sad, setSad] = useState(false)
  const [smile, setSmile] = useState(false)
  const [angry, setAngry] = useState(false)

  const animateModal = (toValue: number, callback?: () => void) => {
    Animated.timing(modalOpacity, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (callback) {
        callback()
      }
    })
  }

  const handleOpenImage = (index: number) => {
    setActiveIndex(index)
    setModalVisible(true)
    animateModal(1)
  }

  const handleCloseImage = () => {
    animateModal(0, () => {
      modalOpacity.setValue(0)
      setModalVisible(false)
      setActiveIndex(null)
    })
  }

  const screenWidth = Dimensions.get("window").width
  const imageWidth = screenWidth / 4

  return (
    <View style={styles.container}>
      {medias &&
        medias.map((item, index) => (
          <TouchableOpacity key={item.id} onPress={() => handleOpenImage(index)}>
            <Image source={{ uri: item.url }} style={{ ...styles.image, width: imageWidth }} />
          </TouchableOpacity>
        ))}
      <Modal visible={modalVisible} transparent={true} onRequestClose={handleCloseImage}>
        <Animated.View style={{ ...styles.modalContainer, opacity: modalOpacity }}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseImage}>
            <Icon size={30} icon="x" color="black" />
          </TouchableOpacity>

          {activeIndex !== null && medias[activeIndex] && (
            <>
              <Image source={{ uri: medias[activeIndex].url }} style={styles.modalImage} />
              <Card
                ContentComponent={
                  <>
                    <Text
                      style={styles.title}
                      text={
                        (medias[activeIndex].title
                          ? medias[activeIndex].title
                          : "No title") as string
                      }
                    />

                    <Text
                      style={styles.description}
                      text={
                        "created at: " +
                        new Date(medias[activeIndex].created_at).toLocaleDateString()
                      }
                    />

                    <Text
                      style={styles.description}
                      text={"uploaded by: " + medias[activeIndex].uploader?.username}
                    />
                    <Text
                      style={styles.description}
                      text={"hashtags: " + medias[activeIndex].hashtag?.join(", ")}
                    />
                  </>
                }
              />
              <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => setHeart(!heart)}>
                  {heart ? (
                    <Icon
                      icon="heartFill"
                      size={30}
                      color={"red"}
                      label="albumScreen.reaction.heart"
                    />
                  ) : (
                    <Icon
                      icon="heart"
                      size={30}
                      color={"black"}
                      label="albumScreen.reaction.heart"
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setThumb(!thumb)}>
                  <Icon
                    icon="thumb"
                    size={30}
                    color={thumb ? colors.tint : "black"}
                    label="albumScreen.reaction.thumb"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSad(!sad)}>
                  <Icon
                    icon="sad"
                    size={30}
                    color={sad ? colors.tint : "black"}
                    label="albumScreen.reaction.sad"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSmile(!smile)}>
                  <Icon
                    icon="smile"
                    size={30}
                    color={smile ? colors.tint : "black"}
                    label="albumScreen.reaction.smile"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setAngry(!angry)}>
                  <Icon
                    icon="angry"
                    size={30}
                    color={angry ? colors.tint : "black"}
                    label="albumScreen.reaction.angry"
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    height: "100%",
    width: "100%",
  },
  image: {
    height: 100,
  },
  modalCloseButton: {
    borderRadius: 5,
    padding: 10,
    position: "absolute",
    right: 20,
    top: 40,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  modalCloseText: {
    color: "#fff",
    fontSize: 18,
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    flex: 1,
    justifyContent: "center",
    padding: 20,
    
  },
  modalImage: {
    height: "50%",
    resizeMode: "contain",
    width: "100%",
  },
  title: {
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    alignSelf: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
})
