import { MediaModel } from "./Media"
import { UserModel } from "./User"

test("can be created", () => {
  const instance = MediaModel.create({
    id: "1",
    created_at: "2023-01-01",
    title: "Test Media",
    is_video: false,
    url: "http://example.com/media.jpg",
    album_id: "album1",
    uploader: UserModel.create({
      id: "user1",
      created_at: "2023-01-01",
      username: "testuser",
      avatar_url: "http://example.com/avatar.jpg",
      email: "testuser@example.com",
    }),
    hashtag: ["#test"],
  })

  expect(instance).toBeTruthy()
  expect(instance.title).toBe("Test Media")
  expect(instance.uploader?.username).toBe("testuser")
})
