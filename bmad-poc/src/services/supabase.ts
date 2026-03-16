import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

// Type definitions for user data
export interface User {
  id: string
  email: string
  created_at: string
}

// Type definitions for task data
export interface Task {
  id: number
  user_id: string
  title: string
  description: string
  is_completed: boolean
  created_at: string
  updated_at: string
}
