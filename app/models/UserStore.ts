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
      const { username, avatar_url } = userInfo
      store.userInfo.username = username
      store.userInfo.avatar_url =
        avatar_url ||
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    },
  }))

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}
