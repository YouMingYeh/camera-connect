export interface MediaItem {
  id: string
  created_at: string
  title: string
  is_video: boolean
  url: string
  album_id: string
  uploader_id: string
  hashtag: string[]
}

export interface SearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleBack: () => void
  type: string
  setType: (type: string) => void
}
