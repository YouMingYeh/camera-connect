import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const PROJECT_URL = "https://adjixakqimigxsubirmn.supabase.co"
const PROJECT_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkaml4YWtxaW1pZ3hzdWJpcm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3ODk1NTEsImV4cCI6MjAyOTM2NTU1MX0.wY-4aRx_mFOZJKc_8le4dpjCyaCGNqfc94hlhKC4-74"

export const supabase = createClient(PROJECT_URL, PROJECT_PUBLIC_KEY)

export const getUserId = async (safecheck = true) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user === null) {
      return null
    }

    if (safecheck) {
      const { data, error } = await supabase.from("user").select().eq("id", user.id)
      if (error) {
        throw Error("Supabase data format incorrect")
      }
      if (data.length === 0) {
        const { error } = await supabase
          .from("user")
          .insert({ id: user.id, username: user.email, email: user.email || "Unnamed User" })
        if (error) {
          throw Error("Failed to insert user column")
        }
      } else if (data.length !== 1) {
        throw Error("Supabase duplicated user column")
      }
    }
    return user.id
  } catch (e) {
    return null
  }
}
