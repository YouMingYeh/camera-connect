import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { EpisodeStoreModel } from "./EpisodeStore"
import { JoinAlbumStoreModel } from "./JoinAlbumStore"
import { UserStoreModel } from "./UserStore"
import { MediaStoreModel } from "./MediaStore"
/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  episodeStore: types.optional(EpisodeStoreModel, {}),
  joinAlbumStore: types.optional(JoinAlbumStoreModel, {}),
  userStores: types.optional(UserStoreModel, {}),
  mediaStore: types.optional(MediaStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
