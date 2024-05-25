import { MediaViewedModel } from "./MediaViewed"

test("can be created", () => {
  const instance = MediaViewedModel.create({})

  expect(instance).toBeTruthy()
})
