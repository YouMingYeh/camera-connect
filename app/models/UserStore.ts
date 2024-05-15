import { Instance, SnapshotOut, types } from "mobx-state-tree"

interface UserInfo {
  username: string
  avatar_url: string
}

export const UserStoreModel = types
  .model("UserStore")
  .props({
    userInfo: types.optional(
      types.model("UserInfo", {
        username: types.string,
        avatar_url: types.string,
      }),
      { username: "", avatar_url: "" },
    ),
  })
  .actions((store) => ({
    setUserInfo(userInfo: UserInfo) {
      store.userInfo = userInfo
    },
  }))

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}
