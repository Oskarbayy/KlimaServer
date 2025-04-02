// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uioawrrgevzolgdniqwz.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Add validation to ensure the key exists
if (!supabaseKey) {
  console.error('Missing VITE_SUPABASE_KEY environment variable')
}

// Create and export the client
export const supabase = createClient(supabaseUrl, supabaseKey)