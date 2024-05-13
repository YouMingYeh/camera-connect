import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const AlbumModel = types
  .model("Album")
  .props({
    id: "",
    created_at: "",
    description: types.maybeNull(types.string),
    cover_url:  types.maybeNull(types.string),
    album_name: "",
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Album extends Instance<typeof AlbumModel> {}
export interface AlbumSnapshotOut extends SnapshotOut<typeof AlbumModel> {}
export interface AlbumSnapshotIn extends SnapshotIn<typeof AlbumModel> {}