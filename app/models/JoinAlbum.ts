import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const JoinAlbumModel = types
  .model("JoinAlbum")
  .props({
    user_id: "",
    album_id: "",
    created_at: "",
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface JoinAlbum extends Instance<typeof JoinAlbumModel> {}
export interface JoinAlbumSnapshotOut extends SnapshotOut<typeof JoinAlbumModel> {}
export interface JoinAlbumSnapshotIn extends SnapshotIn<typeof JoinAlbumModel> {}
export const createJoinAlbumDefaultModel = () => types.optional(JoinAlbumModel, {})
