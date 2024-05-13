import { AlbumModel } from "./Album"

test("can be created", () => {
  const instance = AlbumModel.create({})

  expect(instance).toBeTruthy()
})
