/* eslint-disable react-native/no-color-literals */
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Modal, StyleSheet, Text, Dimensions } from 'react-native';

interface ImageItem {
  id: string;
  url: string;
}

interface GalleryProps {
  images: ImageItem[];
}

export default function Gallery({ images }: GalleryProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const handleOpenImage = (url: string) => {
    setActiveImage(url);
    setModalVisible(true);
  };

  const handleCloseImage = () => {
    setModalVisible(false);
    setActiveImage(null);
  };

  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth / 4;

  return (
    <View style={styles.container}>
      {images.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => handleOpenImage(item.url)}>
          <Image source={{ uri: item.url }} style={{ ...styles.image, width: imageWidth }} />
        </TouchableOpacity>
      ))}
      <Modal visible={modalVisible} transparent={true} onRequestClose={handleCloseImage}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseImage}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
          {activeImage && (
            <Image source={{ uri: activeImage }} style={styles.modalImage} />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '100%',
    width: '100%',
  },
  image: {
    height: 100,
  },
  modalCloseButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 5,
    padding: 10,
    position: 'absolute',
    right: 20,
    top: 40,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    flex: 1,
    justifyContent: 'center',
  },
  modalImage: {
    height: '70%',
    resizeMode: 'contain',
    width: '90%',
  },
});