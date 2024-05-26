import { MediaViewedModel } from "./MediaViewed"

test("can be created", () => {
  const instance = MediaViewedModel.create({
    mediaIds: ["1", "2"],
  })

  expect(instance).toBeTruthy()
})

test("can add mediaId", () => {
  const instance = MediaViewedModel.create({
    mediaIds: [],
  })

  instance.addMediaId("1")

  expect(instance.mediaIds.length).toBe(1)
})

test("can remove mediaId", () => {
  const instance = MediaViewedModel.create({
    mediaIds: ["1"],
  })

  instance.removeMediaId("1")

  expect(instance.mediaIds.length).toBe(0)
})

test("can get the set of mediaIds", () => {
  const instance = MediaViewedModel.create({
    mediaIds: ["1", "2"],
  })

  expect(instance.mediaIdsSet).toEqual(new Set(["1", "2"]))
})

test("can clear mediaIds", () => {
  const instance = MediaViewedModel.create({
    mediaIds: ["1", "2"],
  })

  instance.clearMediaIds()

  expect(instance.mediaIds.length).toBe(0)
})
