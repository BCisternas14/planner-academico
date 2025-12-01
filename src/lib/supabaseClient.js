import { createClient } from '@supabase/supabase-js';

// Asegúrate de tener estas variables en tu archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Usa la Service Role Key para poder crear usuarios sin restricciones de RLS iniciales

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Función helper para buscar o crear usuario
export const getOrCreateUser = async (nombre) => {
  if (!nombre) return null;

  // 1. Buscar si existe
  const { data: existente, error: errorBusqueda } = await supabase
    .from('usuarios')
    .select('*')
    .eq('nombre', nombre)
    .single();

  if (existente) {
    return existente;
  }

  // 2. Si no existe (error PGRST116 es "no rows returned"), lo creamos
  // Nota: Si usas SERIAL id, Supabase lo genera automáticamente.
  const { data: nuevo, error: errorCreacion } = await supabase
    .from('usuarios')
    .insert([{ nombre: nombre }])
    .select()
    .single();

  if (errorCreacion) {
    console.error('Error creando usuario:', errorCreacion);
    return null;
  }

  return nuevo;
};