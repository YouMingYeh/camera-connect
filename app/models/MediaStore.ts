import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SupabaseClient } from "@supabase/supabase-js"
import { Media, MediaModel } from "./Media"

export async function readMediaByAlbumId(supabaseClient: SupabaseClient, albumId: string) {
  const { data, error } = await supabaseClient
    .from("media")
    .select(
      `
      id,
      created_at,
      title,
      is_video,
      url,
      album_id,
      uploader_id ( id, created_at, username, avatar_url, email ),
      hashtag,
      heart,
      thumb,
      sad,
      smile,
      angry
`,
    )
    .eq("album_id", albumId)

  if (error) {
    console.error("Failed to fetch medias:", error.message)
    return null
  }

  return data
}

export const MediaStoreModel = types
  .model("MediaStore")
  .props({
    medias: types.array(MediaModel),
  })
  .actions(withSetPropAction)
  .views((store) => ({
    get MediasForList(): Media[] {
      // Add return type annotation
      return store.medias
    },
  }))
  .actions((store) => ({
    async fetchMedias(supabaseClient: SupabaseClient, albumId: string) {
      const medias = await readMediaByAlbumId(supabaseClient, albumId)
      const mediaModels = medias?.map((media) => {
        return {
          id: media.id,
          created_at: media.created_at,
          title: media.title,
          is_video: media.is_video,
          url: media.url,
          album_id: media.album_id,
          uploader: media.uploader_id,
          hashtag: media.hashtag,
          heart: media.heart,
          thumb: media.thumb,
          sad: media.sad,
          smile: media.smile,
          angry: media.angry,
        }
      })
      if (medias?.length === 0) {
        console.log("No medias found")
        store.setProp("medias", [])
        return
      }
      if (medias) {
        store.setProp("medias", mediaModels)
      } else {
        console.error(`Error fetching medias: ${JSON.stringify(medias)}`)
      }
    },
    addMedia(media: Media) {
      store.medias.push(media)
    },
    removeJoinAlbum(media: Media) {
      store.medias.remove(media)
    },
    updateMedia(media: Media) {
      const index = store.medias.findIndex((m) => m.id === media.id)
      if (index === -1) {
        console.error(`Media with id ${media.id} not found`)
        return
      }
      store.medias[index].title = media.title
      store.medias[index].hashtag = media.hashtag
    },
  }))

export interface MediaStore extends Instance<typeof MediaStoreModel> {}
export interface MediaStoreSnapshot extends SnapshotOut<typeof MediaStoreModel> {}
