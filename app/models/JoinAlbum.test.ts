import { JoinAlbumModel } from "./JoinAlbum"

test("can be created", () => {
  const instance = JoinAlbumModel.create({})

  expect(instance).toBeTruthy()
})
