import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { JoinAlbum, JoinAlbumModel } from "./JoinAlbum"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { SupabaseClient } from "@supabase/supabase-js"

async function readJoinAlbums(supabaseClient: SupabaseClient, userId: string) {
  const { data, error } = await supabaseClient
  .from("join_album")
  .select()
  .eq("id", userId)
  .select()

  if (error) {
    console.error("Failed to fetch join_album:", error.message)
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
  .views(() => ({
    
  }))
  .actions((store) => ({
    async fetchJoinAlbums(supabaseClient: SupabaseClient, userId: string) {
      const joinAlbums = await readJoinAlbums(supabaseClient, userId)
      if (joinAlbums) {
        store.setProp("joinAlbums", joinAlbums)
      } else {
        console.error(`Error fetching episodes: ${JSON.stringify(joinAlbums)}`)
      }
    },
    addJoinAlbum(joinAlbum: JoinAlbum) {
      store.joinAlbums.push(joinAlbum)
    },
    removeJoinAlbum(joinAlbum: JoinAlbum) {
      store.joinAlbums.remove(joinAlbum)
    }
  }))

export interface AuthenticationStore extends Instance<typeof JoinAlbumStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof JoinAlbumStoreModel> {}
