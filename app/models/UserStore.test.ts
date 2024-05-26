import { UserStoreModel } from "./UserStore"

describe("UserStoreModel Tests", () => {
  test("can be created", () => {
    const instance = UserStoreModel.create({
      userInfo: {
        username: "initialUser",
        avatar_url: "http://example.com/avatar.jpg",
      },
    })

    expect(instance).toBeTruthy()
    expect(instance.userInfo.username).toBe("initialUser")
    expect(instance.userInfo.avatar_url).toBe("http://example.com/avatar.jpg")
  })

  test("can update userInfo", () => {
    const instance = UserStoreModel.create({
      userInfo: {
        username: "initialUser",
        avatar_url: "http://example.com/avatar.jpg",
      },
    })

    const newUserInfo = {
      username: "testuser",
      avatar_url: "http://example.com/new_avatar.jpg",
    }

    instance.setUserInfo(newUserInfo)

    expect(instance.userInfo.username).toBe("testuser")
    expect(instance.userInfo.avatar_url).toBe("http://example.com/new_avatar.jpg")
  })
})
