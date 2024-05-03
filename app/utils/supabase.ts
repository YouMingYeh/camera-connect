import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const project_url = "https://adjixakqimigxsubirmn.supabase.co"
const project_public_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkaml4YWtxaW1pZ3hzdWJpcm1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3ODk1NTEsImV4cCI6MjAyOTM2NTU1MX0.wY-4aRx_mFOZJKc_8le4dpjCyaCGNqfc94hlhKC4-74"

export const supabase = createClient(project_url, project_public_key)


export const get_userid = async (safecheck = true) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user === null) {
        throw Error("User not logged in")
    }

    if (safecheck) {
        const { data, error } = await supabase
            .from('user')
            .select()
            .eq("id", user.id)
        if (error) {
            throw Error("Supabase data format incorrect")
        }
        if (data.length == 0) {
            const { error } = await supabase
                .from('user')
                .insert({ id: user.id, username: user.email || "Unnamed User" })
            if (error) {
                throw Error("Failed to insert user column")
            }

        }
        else if (data.length != 1) {
            throw Error("Supabase duplicated user column")
        }

    }

    return user.id
}