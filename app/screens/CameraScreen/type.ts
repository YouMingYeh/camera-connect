import { CameraCapturedPicture } from "expo-camera"

export type VideoType = {
  uri: string
}

export type ImageType = CameraCapturedPicture

export type Media = {
  type: "image" | "video"
  data: ImageType | VideoType
}
