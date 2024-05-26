import { JoinAlbumModel } from "./JoinAlbum"

test("can be created", () => {
  const instance = JoinAlbumModel.create({
    user_id: "1",
    album: {
      id: "1",
      created_at: "2022-01-20 21:05:36",
      description: "description",
      cover_url: "cover_url",
      album_name: "album_name",
    },
    created_at: "2022-01-20 21:05:36",
  })

  expect(instance).toBeTruthy()
})
