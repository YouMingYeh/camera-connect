import React, { useState, useEffect } from "react"
import { View, TextInput, StyleSheet, Pressable, Text, Image, Platform } from "react-native"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null)

  const handlePress = () => {
    if (expanded) {
      setSearchQuery("")
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
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCodeText: {
    marginTop: 10,
    fontSize: 16,
  },
  scrollContentContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  albumCover: {
    borderRadius: 25,
    height: 50,
    width: 50,
  },
  albumName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  albumRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  container: {
    paddingTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  expandButton: {
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 4,
    height: 60,
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    position: "relative",
    width: 300,
    alignSelf: "center",
  },
  expandButtonIcon: {
    position: "absolute",
    right: 16,
  },
  expandButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
    backgroundColor: "white",
  },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
  },
  inputWeb: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    marginBottom: 5,
  },
})

export default Albums