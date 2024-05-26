import { CameraCapturedPicture } from "expo-camera"

export type VideoType = {
  uri: string
}

export type ImageType = CameraCapturedPicture

export type Media = {
  type: "image" | "video"
  data: ImageType | VideoType
}

export type MediaCreate = {
  id: string
  title: string
  is_video: boolean
  url: string
  album_id: string
  uploader_id: string
  hashtag: string[]
}
