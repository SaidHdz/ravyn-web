import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Blindaje: Si faltan credenciales, creamos un cliente dummy o avisamos en consola
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Advertencia: Faltan credenciales de Supabase en el archivo .env. El Viewer no podrá cargar datos reales.");
}

// Inicialización segura
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
