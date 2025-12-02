'use server';

import { createClient } from '@supabase/supabase-js';

// 1. Verificación de seguridad
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceKey || !serviceKey.startsWith('ey')) {
  console.error("🚨 ALERTA: La SUPABASE_SERVICE_ROLE_KEY parece inválida.");
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey,
  {
    auth: {
      persistSession: false,
    }
  }
);

// --- METAS ---

export async function fetchUserGoals(userId) {
  if (!userId) return [];

  const { data, error } = await supabaseAdmin
    .from('metas')
    .select('*')
    .eq('usuario_id', parseInt(userId))
    .order('fecha_creacion', { ascending: false });

  if (error) {
    console.error("🚨 ERROR LEYENDO METAS:", error);
    return [];
  }

  return data;
}

export async function createGoal(userId, formData) {
  const titulo = formData.get('titulo');
  const fechaLimite = formData.get('fecha_limite');
  const descripcion = formData.get('descripcion');

  if (!userId) return { error: "Usuario no identificado" };

  try {
    const { data, error } = await supabaseAdmin
      .from('metas')
      .insert([{
        usuario_id: parseInt(userId),
        titulo: titulo,
        descripcion: descripcion || "", // Manejo de descripción opcional
        fecha_limite: fechaLimite || null,
        completada: false
      }])
      .select()
      .single();

    if (error) throw error;

    // CORRECCIÓN IMPORTANTE: Devolvemos 'data' en lugar de 'goal' para ser consistentes
    return { success: true, data: data };

  } catch (e) {
    console.error("🚨 ERROR CREANDO META:", e);
    return { error: e.message };
  }
}

// --- ACTIVIDADES (ESTO FALTABA) ---

export async function createActivity(formData) {
  const metaId = formData.get('meta_id');
  const titulo = formData.get('titulo');
  const descripcion = formData.get('descripcion');
  
  // Validamos que exista ID de meta
  if (!metaId) {
    return { error: "Falta el ID de la meta para crear la actividad." };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('actividades')
      .insert([{
        meta_id: parseInt(metaId),
        titulo: titulo,
        descripcion: descripcion || "",
        completada: false
      }])
      .select()
      .single();

    if (error) throw error;
    
    // Retornamos la actividad creada
    return { success: true, data: data };

  } catch (e) {
    console.error("🚨 ERROR CREANDO ACTIVIDAD:", e);
    return { error: e.message };
  }
}
// ... (resto del código anterior) ...

// --- NUEVA FUNCIÓN: TRAER TODAS LAS ACTIVIDADES DEL USUARIO ---
export async function fetchUserActivities(userId) {
  if (!userId) return [];

  try {
    // Buscamos actividades unidas con la tabla metas para filtrar por usuario
    // El !inner asegura que solo traiga actividades donde la meta pertenece al usuario
    const { data, error } = await supabaseAdmin
      .from('actividades')
      .select('*, metas!inner(usuario_id)') 
      .eq('metas.usuario_id', parseInt(userId))
      .order('id', { ascending: false });

    if (error) throw error;

    // Mapeamos los datos para que tu frontend los entienda
    // (Tu frontend usa 'title' y 'completed', la DB usa 'titulo' y 'completada')
    return data.map(actividad => ({
      id: actividad.id,
      title: actividad.titulo,
      description: actividad.descripcion,
      completed: actividad.completada,
      meta_id: actividad.meta_id
    }));

  } catch (e) {
    console.error("🚨 ERROR LEYENDO ACTIVIDADES:", e);
    return [];
  }
}