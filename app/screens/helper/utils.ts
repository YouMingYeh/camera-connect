import { SupabaseClient } from "@supabase/supabase-js"
import { Alert } from "react-native"
import { Buffer } from "buffer"
import { MediaCreate } from "../CameraScreen/type"

type Album = {
  id: string
  description: string
  cover_url: string
  album_name: string
}

export async function uploadImage(supabase: SupabaseClient, base64: string, filename: string) {
  const { data, error } = await supabase.storage
    .from("media")
    .upload(filename, Buffer.from(base64, "base64"), {
      contentType: "image/jpeg",
      upsert: true,
    })
  if (error) {
    console.log("Error uploading file: ", error.message)
    Alert.alert("出錯了！", "上傳檔案出現錯誤...")
    return
  }
  console.log("Success uploading file: ", data)
}

export async function createAlbum(supabase: SupabaseClient, album: Album) {
  const { data, error } = await supabase.from("album").insert([album])
  if (error) {
    console.log("Error inserting album: ", error.message)
    Alert.alert("出錯了！", "創建相簿出現錯誤...")
    return
  }
  console.log("Success inserting album: ", data)
}

  
export  async function createMedia(supabase: SupabaseClient, medias: MediaCreate[]) {
    const { data, error } = await supabase.from("media").insert(medias)
    if (error) {
      console.log("Error inserting media: ", error.message)
      Alert.alert("出錯了！", "上傳檔案失敗...")
      return
    }
    console.log("Success inserting media: ", data)
  }