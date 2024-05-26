import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { JoinAlbum, JoinAlbumModel } from "./JoinAlbum"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SupabaseClient } from "@supabase/supabase-js"

async function readJoinAlbums(supabaseClient: SupabaseClient, userId: string) {
  const { data, error } = await supabaseClient
    .from("join_album")
    .select(
      `
  user_id,
  album (
    id,
    created_at,
    description,
    cover_url,
    album_name
  ),
  created_at
`,
    )
    .eq("user_id", userId)

  if (error) {
    console.log("Failed to fetch join_album:", error.message)
    return null
  }

  return data
}

export const JoinAlbumStoreModel = types
  .model("JoinAlbumStore")
  .props({
    joinAlbums: types.array(JoinAlbumModel),
  })
  .actions(withSetPropAction)
  .views((store) => ({
    get joinAlbumsForList(): JoinAlbum[] {
      // Add return type annotation
      return store.joinAlbums
    },
  }))
  .actions((store) => ({
    async fetchJoinAlbums(supabaseClient: SupabaseClient, userId: string) {
      const joinAlbums = await readJoinAlbums(supabaseClient, userId)
      if (joinAlbums?.length === 0) {
        console.log("No joinAlbums found")
        store.setProp("joinAlbums", [])
        return
      }
      if (joinAlbums) {
        store.setProp("joinAlbums", joinAlbums)
      } else {
        console.error(`Error fetching joinAlbums: ${JSON.stringify(joinAlbums)}`)
      }
    },
    async joinAlbum(supabaseClient: SupabaseClient, userId: string, albumId: string) {
      const { data, error } = await supabaseClient.from("join_album").insert([
        {
          user_id: userId,
          album_id: albumId,
        },
      ])

      if (error) {
        console.log("Failed to join album:", error.message)
        return null
      }
      return data
    },
    addJoinAlbum(joinAlbum: JoinAlbum) {
      store.joinAlbums.push(joinAlbum)
    },
    removeJoinAlbum(joinAlbum: JoinAlbum) {
      store.joinAlbums.remove(joinAlbum)
    },
  }))

export interface AuthenticationStore extends Instance<typeof JoinAlbumStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof JoinAlbumStoreModel> {}
