import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import {
  View,
  ViewStyle,
  Dimensions,
  TextStyle,
  Image,
  TouchableOpacity,
  ImageStyle,
  ScrollView,
  Modal,
  Keyboard,
} from "react-native"
import { v4 as uuidv4 } from "uuid"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card, Screen, Text, TextField } from "app/components"
import Carousel from "react-native-reanimated-carousel"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"
import { DemoUseCase } from "./DemoShowroomScreen/DemoUseCase"
import { useStores } from "app/models"
import { supabase, getUserId } from "../utils/supabase"
import * as ImagePicker from "expo-image-picker"
import { SupabaseClient } from "@supabase/supabase-js"
import { Buffer } from "buffer"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

// const deviceWidth = Dimensions.get('window').width

interface AlbumFeedScreenProps extends AppStackScreenProps<"AlbumFeed"> {}

type Data = {
  id: string
  title: string | null
  description: string | null
  image: string | null
}

type Album = {
  description: string
  cover_url: string
  album_name: string
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
    alert("Error uploading file")
    return
  }
  console.log("Success uploading file: ", data)
}

async function createAlbum(supabase: SupabaseClient, album: Album) {
  const { data, error } = await supabase.from("album").insert([album])
  if (error) {
    console.log("Error inserting album: ", error.message)
    alert("Error inserting album")
    return
  }
  console.log("Success inserting album: ", data)
}

export const AlbumFeedScreen: FC<AlbumFeedScreenProps> = observer(function AlbumScreen(_props) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const { navigation } = _props
  const { joinAlbumStore } = useStores()
  const [userID, setUserID] = React.useState("")
  const [modalOpen, setModalOpen] = React.useState(false)

  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [cover, setCover] = React.useState("")

  useEffect(() => {
    getUserId().then((id: string | null) => {
      if (id !== null) {
        setUserID(id)
      }
    })
  }, [])

  function goNext(albumId: string) {
    navigation.navigate("Album", { albumId })
  }

  async function handleCreateAlbum() {
    if (title === "" || description === "" || cover === "") {
      alert("請填寫完整！")
      return
    }
    const filename = `media-${uuidv4()}`

    const album: Album = {
      description,
      cover_url:
        "https://adjixakqimigxsubirmn.supabase.co/storage/v1/object/public/media/" + filename,
      album_name: title,
    }

    await createAlbum(supabase, album)
    await uploadImage(supabase, cover, filename)
    setModalOpen(false)
  }

  const width = Dimensions.get("window").width
  const data: Data[] = joinAlbumStore.joinAlbumsForList.map((joinAlbum) => {
    return {
      id: joinAlbum.album.id,
      title: joinAlbum.album.album_name,
      description: joinAlbum.album.description,
      image: joinAlbum.album.cover_url,
    }
  })

  useEffect(() => {
    if (userID === "") return
    joinAlbumStore.fetchJoinAlbums(supabase, userID)
  }, [userID])

  if (data.length === 0) {
    return (
      <Screen style={$root} preset="scroll">
        <Text>No album</Text>
      </Screen>
    )
  }

  const dummyData = [
    {
      id: "1",
      label: "Tagged",
      image: "https://i.pinimg.com/474x/99/3b/03/993b03ee99d99df1022ab8f79f00a340.jpg",
    },
    {
      id: "2",
      label: "New",
      image: "https://i.pinimg.com/474x/f9/4d/ea/f94dea422b19ac51bd7eec4f2333f30b.jpg",
    },
    {
      id: "3",
      label: "Commented",
      image: "https://i.pinimg.com/474x/6b/15/bf/6b15bf365da2528c44449065c491bb8d.jpg",
    },
    {
      id: "4",
      label: "Reacted",
      image: "https://i.pinimg.com/474x/26/cb/16/26cb162da8274a03f516fdd386f883a3.jpg",
    },
  ]

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    })

    if (!result.canceled) {
      const base64 = result.assets[0].base64 || ""
      setCover(base64)
    }
  }

  return (
    <Screen style={$root} preset="scroll">
      <DemoDivider size={50} />
      <DemoUseCase name="最近動態" description="你的相簿成員最近更新了這些照片！" layout="column">
        <Carousel
          loop
          mode="parallax"
          width={width * 0.9}
          style={$carousel}
          modeConfig={{
            parallaxScrollingScale: 0.8,
            parallaxScrollingOffset: 100,
          }}
          height={width / 2}
          data={dummyData}
          scrollAnimationDuration={200}
          renderItem={({ item }) => (
            <View style={$item}>
              {item.image && (
                <Image source={{ uri: item.image }} style={$image} resizeMode="cover" />
              )}
              <View style={$badge}>
                <Text style={$text1}>{item.label}</Text>
              </View>
            </View>
          )}
        />
      </DemoUseCase>

      <DemoDivider size={10} />
      <DemoUseCase name="你的相簿" description="你加入的相簿" layout="column">
        <ScrollView style={$container}>
          {data.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => goNext(item.id)}>
              <Text style={$text2}>{item.title}</Text>
              {item.image && (
                <Image source={{ uri: item.image }} style={$image} resizeMode="cover" />
              )}

              <Text> </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </DemoUseCase>
      <Button preset="reversed" onPress={() => setModalOpen(!modalOpen)}>
        創建相簿
      </Button>
      <Modal animationType="fade" transparent={true} visible={modalOpen}>
        <View style={$modal}>
          <Card
            style={$card}
            ContentComponent={
              <View
                style={$cardContent}
                onTouchStart={() => {
                  Keyboard.dismiss()
                }}
              >
                <TextField
                  label="相簿名稱"
                  value={title}
                  placeholder="輸入相簿名稱"
                  onChange={(e) => {
                    setTitle(e.nativeEvent.text)
                  }}
                />
                <TextField
                  label="相簿描述"
                  value={description}
                  placeholder="輸入相簿描述"
                  multiline
                  onChange={(e) => {
                    setDescription(e.nativeEvent.text)
                  }}
                />
                <Text>選擇封面</Text>
                <Image
                  source={{ uri: `data:image/png;base64,${cover}` }}
                  style={$image}
                  resizeMode="cover"
                />
                <Button onPress={pickImage} preset="filled">
                  上傳封面
                </Button>
              </View>
            }
          />

          <Button style={$button} preset="reversed" onPress={handleCreateAlbum}>
            確認
          </Button>
          <Button style={$button} onPress={() => setModalOpen(false)}>
            關閉
          </Button>
        </View>
      </Modal>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  paddingHorizontal: 8,
}

const $modal: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  flex: 1,
  gap: 10,
}

const $card: ViewStyle = {
  width: "95%",
}

const $cardContent: ViewStyle = {
  width: "100%",
  backgroundColor: "white",
  padding: 10,
  gap: 10,
  flexDirection: "column",
  display: "flex",
}

const $button: ViewStyle = {
  width: "90%",
}

const $item: ViewStyle = {
  flex: 1,
  borderWidth: 1,
  justifyContent: "center",
}

const $container: ViewStyle = {
  flexDirection: "column",
  flex: 1,
  height: 500,
}

const $badge: ViewStyle = {
  position: "absolute",
  top: 5,
  right: 5,
  borderRadius: 10,
  backgroundColor: "white",
  padding: 5,
}
const $text1: TextStyle = { textAlign: "center", fontSize: 20 }

const $text2: TextStyle = { fontSize: 24, fontWeight: "bold" }

const $image: ImageStyle = {
  width: "100%",
  height: 200,
  backgroundColor: "gray",
}

const $carousel: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
