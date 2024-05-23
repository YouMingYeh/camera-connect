import { MediaItem } from "./types"

import { supabase } from "../../utils/supabase"

export const fetchRandomMedia = async (userId: string): Promise<MediaItem[]> => {
  const { data: albums } = await supabase
    .from("join_album")
    .select("album_id")
    .eq("user_id", userId)

  if (albums === null) {
    return []
  }

  const { data, error } = await supabase
    .from("media")
    .select("*")
    .in(
      "album_id",
      albums.map((album) => album.album_id),
    )
    .order("created_at", { ascending: false })
    .limit(15)

  if (error) {
    console.error("Error fetching media:", error)
    return []
  }

  return data
}
