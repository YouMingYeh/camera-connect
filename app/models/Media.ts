import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { UserModel } from "./User"

/**
 * Model description here for TypeScript hints.
 */
export const MediaModel = types
  .model("Media")
  .props({
    id: "",
    created_at: "",
    title: types.maybeNull(types.string),
    is_video: types.boolean,
    url: "",
    album_id: "",
    uploader: types.maybeNull(UserModel),
    hashtag: types.maybeNull(types.array(types.string)),
    heart: types.number,
    thumb: types.number,
    sad: types.number,
    smile: types.number,
    angry: types.number,
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Media extends Instance<typeof MediaModel> {}
export interface MediaSnapshotOut extends SnapshotOut<typeof MediaModel> {}
export interface MediaSnapshotIn extends SnapshotIn<typeof MediaModel> {}
