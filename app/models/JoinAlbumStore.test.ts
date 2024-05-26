import { JoinAlbumStoreModel } from "./JoinAlbumStore"
import { JoinAlbumModel } from "./JoinAlbum"
import { createClient } from "@supabase/supabase-js"

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockResolvedValue({
      data: [
        {
          user_id: "06fb7376-ef25-4785-9756-d84577be603d",
          album: {
            id: "2ccce6e3-dc5c-484b-9d57-f8e3a0cb3984",
            created_at: "2022-01-20 21:05:36",
            description: "description",
            cover_url: "cover_url",
            album_name: "album_name",
          },
          created_at: "2022-01-20 21:05:36",
        },
      ],
    }),
    insert: jest.fn().mockResolvedValue({
      data: [
        {
          user_id: "06fb7376-ef25-4785-9756-d84577be603d",
          album: {
            id: "2ccce6e3-dc5c-484b-9d57-f8e3a0cb3984",
            created_at: "2022-01-20 21:05:36",
            description: "description",
            cover_url: "cover_url",
            album_name: "album_name",
          },
          created_at: "2022-01-20 21:05:36",
        },
      ],
    }),
  }),
}))

test("can be created", () => {
  const instance = JoinAlbumStoreModel.create({
    joinAlbums: [
      JoinAlbumModel.create({
        user_id: "1",
        album: {
          id: "1",
          created_at: "2022-01-20 21:05:36",
          description: "description",
          cover_url: "cover_url",
          album_name: "album_name",
        },
        created_at: "2022-01-20 21:05:36",
      }),
    ],
  })

  expect(instance).toBeTruthy()
})

test("can fetch joinAlbums", async () => {
  const supabaseClient = createClient("url", "key")
  const instance = JoinAlbumStoreModel.create({
    joinAlbums: [],
  })

  const userId = "06fb7376-ef25-4785-9756-d84577be603d"

  await instance.fetchJoinAlbums(supabaseClient, userId)

  expect(instance.joinAlbums.length).toBeGreaterThan(0)
})

test("can join album", async () => {
  const supabaseClient = createClient("url", "key")
  const instance = JoinAlbumStoreModel.create({
    joinAlbums: [],
  })

  const userId = "06fb7376-ef25-4785-9756-d84577be603d"
  const albumId = "2ccce6e3-dc5c-484b-9d57-f8e3a0cb3984"

  await instance.joinAlbum(supabaseClient, userId, albumId)
})

test("can add joinAlbum", () => {
  const instance = JoinAlbumStoreModel.create({
    joinAlbums: [],
  })

  const joinAlbum = JoinAlbumModel.create({
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

  instance.addJoinAlbum(joinAlbum)

  expect(instance.joinAlbums.length).toBe(1)
})

test("can remove joinAlbum", () => {
  const joinAlbum = JoinAlbumModel.create({
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

  const instance = JoinAlbumStoreModel.create({
    joinAlbums: [joinAlbum],
  })

  instance.removeJoinAlbum(joinAlbum)

  expect(instance.joinAlbums.length).toBe(0)
})
