/* eslint-disable react-native/no-inline-styles */
import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import {
  View,
  ViewStyle,
  Dimensions,
  TextStyle,
  TouchableOpacity,
  ImageStyle,
  ScrollView,
  Modal,
  Keyboard,
  Alert,
} from "react-native"
import { Image } from "expo-image"
import { v4 as uuidv4 } from "uuid"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card, Loading, Screen, Text, TextField } from "app/components"
import Carousel from "react-native-reanimated-carousel"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"
import { DemoUseCase } from "./DemoShowroomScreen/DemoUseCase"
import { useStores } from "app/models"
import { supabase, getUserId } from "../utils/supabase"
import * as ImagePicker from "expo-image-picker"
import { useHeader } from "app/utils/useHeader"
import { typography } from "app/theme"
import { createAlbum, uploadImage } from "./helper/utils"
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
  id: string
  description: string
  cover_url: string
  album_name: string
}

// async function uploadImage(supabase: SupabaseClient, base64: string, filename: string) {
//   const { data, error } = await supabase.storage
//     .from("media")
//     .upload(filename, Buffer.from(base64, "base64"), {
//       contentType: "image/jpeg",
//       upsert: true,
//     })
//   if (error) {
//     console.log("Error uploading file: ", error.message)
//     Alert.alert("出錯了！", "上傳檔案出現錯誤...")
//     return
//   }
//   console.log("Success uploading file: ", data)
// }

// async function createAlbum(supabase: SupabaseClient, album: Album) {
//   const { data, error } = await supabase.from("album").insert([album])
//   if (error) {
//     console.log("Error inserting album: ", error.message)
//     Alert.alert("出錯了！", "創建相簿出現錯誤...")
//     return
//   }
//   console.log("Success inserting album: ", data)
// }

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
  const [zoomImage, setZoomImage] = React.useState<string | null>()

  useEffect(() => {
    getUserId().then((id: string | null) => {
      if (id !== null) {
        setUserID(id)
      }
    })
  }, [])

  function goNext(albumId: string, albumName: string) {
    navigation.navigate("Album", { albumId, albumName })
  }

  async function handleCreateAlbum() {
    if (title === "" || description === "" || cover === "") {
      Alert.alert("出錯了！", "請填寫完整！")
      return
    }
    const filename = `media-${uuidv4()}`

    const album: Album = {
      id: uuidv4(),
      description,
      cover_url:
        "https://adjixakqimigxsubirmn.supabase.co/storage/v1/object/public/media/" + filename,
      album_name: title,
    }

    await createAlbum(supabase, album)
    await uploadImage(supabase, cover, filename)
    setModalOpen(false)
    await joinAlbumStore.joinAlbum(supabase, userID, album.id)
    await joinAlbumStore.fetchJoinAlbums(supabase, userID)
    Alert.alert("創建成功", "相簿創建成功！快去看看吧")
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

  const dummyData = [
    {
      id: "1",
      label: "Tagged",
      image: "https://i.pinimg.com/474x/99/3b/03/993b03ee99d99df1022ab8f79f00a340.jpg",
      color: "red",
    },
    {
      id: "2",
      label: "New",
      image: "https://i.pinimg.com/474x/f9/4d/ea/f94dea422b19ac51bd7eec4f2333f30b.jpg",
      color: "blue",
    },
    {
      id: "3",
      label: "Commented",
      image: "https://i.pinimg.com/474x/6b/15/bf/6b15bf365da2528c44449065c491bb8d.jpg",
      color: "green",
    },
    {
      id: "4",
      label: "Reacted",
      image: "https://i.pinimg.com/474x/26/cb/16/26cb162da8274a03f516fdd386f883a3.jpg",
      color: "orange",
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

  useHeader(
    {
      title: "相簿",
      leftIcon: "caretLeft",
      titleStyle: { fontSize: 24, padding: 10 },
      onLeftPress: () => navigation.navigate("Welcome"),
      rightText: "創建相簿",
      onRightPress: () => setModalOpen(true),
    },
    [],
  )

  if (data.length === 0) {
    return (
      <Screen style={$root}>
        <Loading />
      </Screen>
    )
  }

  return (
    <Screen style={$root} preset="scroll">
      <View style={$screen}>
        {/* <GoBackButton goBack={() => navigation.navigate("Welcome")} label={"相簿"} /> */}
        <DemoUseCase name="最近動態" description="你的相簿成員最近更新了這些照片！" layout="column">
          <Carousel
            loop
            autoPlay
            autoPlayInterval={5000}
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
                {item.image ? (
                  <TouchableOpacity onPress={() => setZoomImage(item.image)}>
                    <Image source={{ uri: item.image }} style={$image} contentFit="cover" />
                  </TouchableOpacity>
                ) : (
                  <Loading />
                )}
                <View style={[$badge, { backgroundColor: item.color }]}>
                  <Text style={$text1}>{item.label}</Text>
                </View>
              </View>
            )}
          />
        </DemoUseCase>
        {zoomImage && (
          <Modal animationType="fade" transparent={true} visible={zoomImage !== null}>
            <View style={$modal} onTouchEnd={() => setZoomImage(null)}>
              <Image
                source={{ uri: zoomImage }}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{ width: "100%", height: "60%" }}
                contentFit="contain"
              />
            </View>
          </Modal>
        )}

        <DemoDivider size={10} />
        <DemoUseCase name="你的相簿" description="你加入的相簿" layout="column">
          <ScrollView style={$container}>
            {data.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => goNext(item.id, item.title as string)}
                accessibilityLabel={item.title as string}
              >
                <Text style={$text2}>{item.title}</Text>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={$image} contentFit="cover" />
                ) : (
                  <Loading />
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
                  <Text style={$text2}>創建相簿</Text>
                  <TextField
                    testID="title"
                    accessibilityLabel="相簿名稱"
                    label="相簿名稱"
                    value={title}
                    placeholder="輸入相簿名稱"
                    onChange={(e) => {
                      setTitle(e.nativeEvent.text)
                    }}
                  />
                  <TextField
                    accessibilityLabel="相簿描述"
                    label="相簿描述"
                    testID="description"
                    id="description"
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
                    contentFit="cover"
                  />
                  <Button onPress={pickImage} preset="filled" accessibilityLabel="上傳封面">
                    上傳封面
                  </Button>
                </View>
              }
            />

            <View style={{ flexDirection: "row", gap: 20, width: "90%" }}>
              <Button style={{ flex: 1 }} onPress={() => setModalOpen(false)}>
                關閉
              </Button>
              <Button style={{ flex: 1 }} preset="reversed" onPress={handleCreateAlbum}>
                確認
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $screen: ViewStyle = {
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

const $item: ViewStyle = {
  flex: 1,
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
  padding: 5,
}
const $text1: TextStyle = {
  textAlign: "center",
  fontSize: 20,
  color: "white",
  fontFamily: typography.primary.bold,
}

const $text2: TextStyle = { fontSize: 24, fontFamily: typography.primary.bold, paddingTop: 5 }

const $image: ImageStyle = {
  width: "100%",
  height: 200,
  backgroundColor: "gray",
  borderRadius: 10,
}

const $carousel: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}
