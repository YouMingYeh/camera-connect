import React, { useState, useEffect } from "react"
import { View, StyleSheet, Pressable, Text, Platform } from "react-native"
import { Feather } from "@expo/vector-icons"
import { supabase, getUserId } from "../../utils/supabase"
import QRCode from "react-native-qrcode-svg"
import RNPickerSelect from "react-native-picker-select"
interface Album {
  id: string
  album_name: string
  cover_url: string
}
const Albums = () => {
  const [expanded, setExpanded] = useState(false)
  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null)

  const handlePress = () => {
    if (expanded) {
      setSelectedAlbumId(null)
      setAlbums([])
    }
    setExpanded(!expanded)
  }

  useEffect(() => {
    const fetchAlbums = async () => {
      const userId = await getUserId()
      if (!userId) {
        console.error("User ID not found")
        return
      }

      try {
        const { data: joinData, error: joinError } = await supabase
          .from("join_album")
          .select("album_id")
          .eq("user_id", userId)

        if (joinError) {
          console.error("Error fetching album IDs:", joinError.message)
          return
        }

        const albumIds = joinData.map((j) => j.album_id)
        const { data, error } = await supabase
          .from("album")
          .select("id, album_name, cover_url")
          .in("id", albumIds)

        if (error) {
          console.error("Error fetching albums:", error.message)
          return
        }

        setAlbums(data)
      } catch (err) {
        console.error("An error occurred while fetching albums:", err)
      }
    }

    fetchAlbums()
  }, [])

  return (
    <View>
      <Pressable style={styles.expandButton} onPress={handlePress}>
        <Text style={styles.expandButtonText}>Albums</Text>
        <Feather
          style={styles.expandButtonIcon}
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="white"
        />
      </Pressable>
      {expanded && (
        <View style={styles.container}>
          <RNPickerSelect
            onValueChange={(value) => {
              if (value === "Select an album...") {
                setSelectedAlbumId(null)
              } else {
                setSelectedAlbumId(value)
              }
            }}
            items={albums.map((album) => ({
              label: album.album_name,
              value: album.id,
              key: album.id,
            }))}
            style={{
              ...pickerSelectStyles,
              inputIOS: pickerSelectStyles.inputIOS,
              inputAndroid: pickerSelectStyles.inputAndroid,
              inputWeb: Platform.OS === "web" ? pickerSelectStyles.inputWeb : {},
            }}
            placeholder={{
              label: "Select an album...",
              value: null,
            }}
          />
          {selectedAlbumId ? (
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={JSON.stringify({ type: "joinAlbum", data: selectedAlbumId })}
                size={200}
                color="black"
                backgroundColor="white"
              />
              <Text style={styles.qrCodeText}>Scan to join this album</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  qrCodeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  qrCodeText: {
    fontSize: 16,
    marginTop: 10,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  scrollContentContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  // eslint-disable-next-line react-native/sort-styles, react-native/no-unused-styles
  albumCover: {
    borderRadius: 25,
    height: 50,
    width: 50,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  albumName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  albumRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },
  // eslint-disable-next-line react-native/no-unused-styles, react-native/no-color-literals
  button: {
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 4,
    elevation: 3,
    justifyContent: "center",
    marginTop: 10,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  // eslint-disable-next-line react-native/no-unused-styles, react-native/no-color-literals
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
  },
  // eslint-disable-next-line react-native/no-color-literals
  expandButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "black",
    borderRadius: 4,
    height: 60,
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    position: "relative",
    width: 300,
  },
  expandButtonIcon: {
    position: "absolute",
    right: 16,
  },
  // eslint-disable-next-line react-native/no-color-literals
  expandButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  // eslint-disable-next-line react-native/no-unused-styles, react-native/no-color-literals
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    height: 40,
    margin: 12,
    padding: 10,
    width: "80%",
  },
})

const pickerSelectStyles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  inputIOS: {
    borderColor: "gray",
    borderRadius: 4,
    borderWidth: 1,
    color: "black",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingRight: 30,
    paddingVertical: 12,
  },
  // eslint-disable-next-line react-native/no-color-literals, react-native/sort-styles
  inputAndroid: {
    borderColor: "purple",
    borderRadius: 8,
    borderWidth: 0.5,
    color: "black",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingRight: 30,
    paddingVertical: 8,
  },
  // eslint-disable-next-line react-native/no-color-literals
  inputWeb: {
    borderColor: "gray",
    borderRadius: 4,
    borderWidth: 1,
    color: "black",
    fontSize: 16,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingRight: 30,
    paddingVertical: 12,
  },
})

export default Albums
