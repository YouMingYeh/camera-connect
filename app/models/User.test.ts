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
})
