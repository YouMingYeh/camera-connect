import { uploadImage, createMedia, createAlbum } from "./utils"
import { createClient } from "@supabase/supabase-js"

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: "data" }),
      }),
    },
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: "data" }),
    }),
  }),
}))

describe("uploadImage", () => {
  it("should upload image", async () => {
    const supabase = createClient("url", "key")
    const base64 = "base64"
    const filename = "filename"
    await uploadImage(supabase, base64, filename)

    expect(supabase.storage.from).toHaveBeenCalledWith("media")
    expect(supabase.storage.from("media").upload).toHaveBeenCalledWith(
      filename,
      expect.any(Buffer),
      {
        contentType: "image/jpeg",
        upsert: true,
      },
    )
  })
})

describe("createMedia", () => {
  it("should create media", async () => {
    const supabase = createClient("url", "key")
    const mediaData = [
      {
        id: "id",
        title: "title",
        is_video: true,
        url: "url",
        album_id: "album_id",
        uploader_id: "uploader_id",
        hashtag: ["hashtag"],
      },
    ]

    const result = await createMedia(supabase, mediaData)

    expect(supabase.from).toHaveBeenCalledWith("media")
    expect(supabase.from("media").insert).toHaveBeenCalledWith(mediaData)
    expect(result).toEqual(undefined)
  })
})

describe("createAlbum", () => {
  it("should create album", async () => {
    const supabase = createClient("url", "key")
    const albumData = {
      id: "id",
      description: "description",
      cover_url: "cover_url",
      album_name: "album_name",
    }

    const result = await createAlbum(supabase, albumData)

    expect(supabase.from).toHaveBeenCalledWith("album")
    expect(supabase.from("album").insert).toHaveBeenCalledWith([albumData])
    expect(result).toEqual(undefined)
  })
})
