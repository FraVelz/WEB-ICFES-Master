/**
 * CONFIGURACIÓN CENTRAL DE API
 * Este archivo centraliza toda la configuración de conexión
 * Permite cambiar entre localStorage y supabase
 */

// Cambiar estos valores según el ambiente (Next.js usa NEXT_PUBLIC_ para cliente)
const API_CONFIG = {
  // 'supabase' para Supabase (producción)
  // 'localStorage' para desarrollo local sin backend
  MODE: process.env.NEXT_PUBLIC_API_MODE || 'supabase',
};

// Validar configuración
const validModes = ['localStorage', 'supabase'];
if (!validModes.includes(API_CONFIG.MODE)) {
  console.warn('API_MODE inválido. Usando supabase por defecto');
  API_CONFIG.MODE = 'supabase';
}

export default API_CONFIG;
