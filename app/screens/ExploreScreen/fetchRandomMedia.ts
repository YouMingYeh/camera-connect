import { MediaItem } from "./types"

import { supabase } from "../../utils/supabase"

export const fetchRandomMedia = async (): Promise<MediaItem[]> => {
  const { data, error } = await supabase.from("media").select("*").limit(10)

  if (error) {
    console.error("Error fetching media:", error)
    return []
  }

  return data
}
