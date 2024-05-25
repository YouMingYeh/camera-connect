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

export const fetchFavoriteMedia = async (userId: string): Promise<MediaItem[]> => {
  const { data: reactions, error: reactionError } = await supabase
    .from("react")
    .select("media_id")
    .eq("user_id", userId)
    .eq("heart", true)

  if (reactionError) {
    console.error("Error fetching reactions:", reactionError)
    return []
  }

  if (!reactions || reactions.length === 0) {
    return []
  }

  const { data: mediaItems, error: mediaError } = await supabase
    .from("media")
    .select("*")
    .in(
      "id",
      reactions.map((reaction) => reaction.media_id),
    )
    .order("created_at", { ascending: false })
    .limit(15)

  if (mediaError) {
    console.error("Error fetching media items:", mediaError)
    return []
  }

  return mediaItems
}
