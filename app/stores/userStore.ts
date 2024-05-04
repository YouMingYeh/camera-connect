import { makeAutoObservable } from "mobx"
interface UserInfo {
  username: string
  avatar_url: string
}
class UserStore {
  userInfo = {
    username: "",
    avatar_url: "",
  }

  constructor() {
    makeAutoObservable(this)
  }

  setUserInfo(userInfo: UserInfo) {
    this.userInfo = userInfo
  }
}

export const userStore = new UserStore()
