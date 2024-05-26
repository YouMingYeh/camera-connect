import { JoinAlbumStoreModel } from "./JoinAlbumStore"
import { JoinAlbumModel } from "./JoinAlbum"
import { createClient } from "@supabase/supabase-js"

const PROJECT_URL = "https://adjixakqimigxsubirmn.supabase.co"
const PROJECT_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkaml4YWtxaW1pZ3hzdWJpcm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3ODk1NTEsImV4cCI6MjAyOTM2NTU1MX0.wY-4aRx_mFOZJKc_8le4dpjCyaCGNqfc94hlhKC4-74"

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
  const supabaseClient = createClient(PROJECT_URL, PROJECT_PUBLIC_KEY)
  const instance = JoinAlbumStoreModel.create({
    joinAlbums: [],
  })

  const userId = "06fb7376-ef25-4785-9756-d84577be603d"

  await instance.fetchJoinAlbums(supabaseClient, userId)

  expect(instance.joinAlbums.length).toBeGreaterThan(0)
})

test("can join album", async () => {
  const supabaseClient = createClient(PROJECT_URL, PROJECT_PUBLIC_KEY)
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
}
)

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
