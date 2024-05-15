import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SupabaseClient } from "@supabase/supabase-js"
import { Media, MediaModel } from "./Media"

async function readMediaByAlbumId(supabaseClient: SupabaseClient, albumId: string) {
  const { data, error } = await supabaseClient
    .from("media")
    .select("*")
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
      if (medias) {
        store.setProp("medias", medias)
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
  }))

export interface AuthenticationStore extends Instance<typeof MediaStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof MediaStoreModel> {}
