import { UserModel } from "./User"

describe("UserModel Tests", () => {
  test("can be created", () => {
    const instance = UserModel.create({
      id: "1",
      created_at: "2023-01-01",
      username: "initialUser",
      avatar_url: null,
      email: "initial@example.com",
    })

    expect(instance).toBeTruthy()
  })

  test("can update userInfo", () => {
    const instance = UserModel.create({
      id: "1",
      created_at: "2023-01-01",
      username: "initialUser",
      avatar_url: null,
      email: "initial@example.com",
    })

    const newUserInfo = {
      username: "testuser",
      avatar_url: "http://example.com/avatar.jpg",
    }

    instance.setUserInfo(newUserInfo)

    expect(instance.username).toBe("testuser")
    expect(instance.avatar_url).toBe("http://example.com/avatar.jpg")
  })
})
