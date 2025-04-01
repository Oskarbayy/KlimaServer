import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './components/App.jsx'
import { createClient } from '@supabase/supabase-js'

// Create a single Supabase client instance to use throughout the app
const supabaseUrl = 'https://uioawrrgevzolgdniqwz.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)