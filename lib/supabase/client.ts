import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// Check if environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️  PERHATIAN: Environment variables Supabase belum dikonfigurasi!')
  console.error('📝 Silakan edit file .env.local dengan nilai dari Supabase Anda')
  console.error('🔗 Panduan: Baca file QUICK_START.md')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClientComponentClient()
  : null as any

// Client untuk server-side
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase belum dikonfigurasi. Edit file .env.local')
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

