import { createClient } from '@supabase/supabase-js'

// Credenciales proporcionadas para el entorno de producción/cloud
const supabaseUrl = 'https://ravyn-api.srv1574981.hstgr.cloud'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQxOTk2ODAwLCJleHAiOjE4OTk3NjMyMDB9.M5zw3Hik5yVE0UeIRq5xq2hbG6YsAcvd4dbdlFChNko'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
