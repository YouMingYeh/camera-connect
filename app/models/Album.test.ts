import { AlbumModel } from "./Album"

test("can be created", () => {
  const instance = AlbumModel.create({
    id: "1",
    created_at: "2022-01-20 21:05:36",
    description: "description",
    cover_url: "cover_url",
    album_name: "album_name",
  })

  expect(instance).toBeTruthy()
})
