import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

// No lanzamos error si faltan las credenciales para permitir que la web cargue como maqueta
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
