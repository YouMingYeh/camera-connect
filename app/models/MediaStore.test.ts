import { MediaStoreModel } from "./MediaStore"
import { MediaModel } from "./Media"
import { createClient } from "@supabase/supabase-js"

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({
      data: [
        {
          id: "1",
          created_at: "2023-01-01",
          title: "Fetched Media",
          is_video: false,
          url: "http://example.com/fetched_media.jpg",
          album_id: "album1",
          uploader_id: {
            id: "user1",
            created_at: "2023-01-01",
            username: "testuser",
            avatar_url: "http://example.com/avatar.jpg",
            email: "testuser@example.com",
          },
          hashtag: ["#test"],
          heart: 1,
          thumb: 1,
          sad: 1,
          smile: 1,
          angry: 1,
        },
      ],
    }),
  }),
}))

describe("MediaStoreModel", () => {
  test("can be created", () => {
    const instance = MediaStoreModel.create({
      medias: [],
    })

    expect(instance).toBeTruthy()
  })

  test("can add media", () => {
    const instance = MediaStoreModel.create({
      medias: [],
    })

    const newMedia = MediaModel.create({
      id: "1",
      created_at: "2023-01-01",
      title: "New Media",
      is_video: false,
      url: "http://example.com/media.jpg",
      album_id: "album1",
      uploader: {
        id: "user1",
        created_at: "2023-01-01",
        username: "testuser",
        avatar_url: "http://example.com/avatar.jpg",
        email: "testuser@example.com",
      },
      hashtag: ["#test"],
      heart: 1,
      thumb: 1,
      sad: 1,
      smile: 1,
      angry: 1,
    })

    instance.addMedia(newMedia)

    expect(instance.medias.length).toBe(1)
    expect(instance.medias[0].id).toBe("1")
    expect(instance.medias[0].title).toBe("New Media")
  })

  test("can remove media", () => {
    const instance = MediaStoreModel.create({
      medias: [],
    })

    const mediaToRemove = MediaModel.create({
      id: "1",
      created_at: "2023-01-01",
      title: "Media to Remove",
      is_video: false,
      url: "http://example.com/media.jpg",
      album_id: "album1",
      uploader: {
        id: "user1",
        created_at: "2023-01-01",
        username: "testuser",
        avatar_url: "http://example.com/avatar.jpg",
        email: "testuser@example.com",
      },
      heart: 1,
      thumb: 1,
      sad: 1,
      smile: 1,
      angry: 1,
      hashtag: ["#test"],
    })

    instance.addMedia(mediaToRemove)
    expect(instance.medias.length).toBe(1)

    instance.removeJoinAlbum(mediaToRemove)
    expect(instance.medias.length).toBe(0)
  })

  test("can fetch medias", async () => {
    const instance = MediaStoreModel.create({
      medias: [],
    })

    const client = createClient("url", "key")
    const albumId = "album1"

    await instance.fetchMedias(client, albumId)

    expect(instance.medias.length).toBe(1)
    expect(instance.medias[0].id).toBe("1")
    expect(instance.medias[0].title).toBe("Fetched Media")
  })
})
