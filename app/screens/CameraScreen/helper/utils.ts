import { SupabaseClient } from "@supabase/supabase-js"
import { Alert } from "react-native"
import { MediaCreate } from "../type"
import { Buffer } from "buffer"

export async function uploadImage(supabase: SupabaseClient, base64: string, filename: string) {
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

export async function createMedia(supabase: SupabaseClient, medias: MediaCreate[]) {
  const { data, error } = await supabase.from("media").insert(medias)
  if (error) {
    console.log("Error inserting media: ", error.message)
    Alert.alert("出錯了！", "上傳檔案失敗...")
    return
  }
  console.log("Success inserting media: ", data)
}
