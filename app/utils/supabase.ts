import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const project_url = "https://adjixakqimigxsubirmn.supabase.co"
const project_public_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkaml4YWtxaW1pZ3hzdWJpcm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3ODk1NTEsImV4cCI6MjAyOTM2NTU1MX0.wY-4aRx_mFOZJKc_8le4dpjCyaCGNqfc94hlhKC4-74"

export const supabase = createClient(project_url, project_public_key)