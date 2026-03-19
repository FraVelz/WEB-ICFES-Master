/**
 * CONFIGURACIÓN CENTRAL DE API
 * Este archivo centraliza toda la configuración de conexión
 * Permite cambiar entre localStorage, supabase y api REST
 */

// Cambiar estos valores según el ambiente (Next.js usa NEXT_PUBLIC_ para cliente)
const API_CONFIG = {
  // 'supabase' para Supabase (producción)
  // 'localStorage' para desarrollo local sin backend
  // 'api' para conectarse a un backend REST
  MODE: process.env.NEXT_PUBLIC_API_MODE || 'supabase',

  // URL del backend (cuando MODE === 'api')
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',

  // Token para autenticación (cuando MODE === 'api')
  API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN || null,

  // Timeouts y configuración
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3
};

// Validar configuración
const validModes = ['localStorage', 'api', 'supabase'];
if (!validModes.includes(API_CONFIG.MODE)) {
  console.warn('API_MODE inválido. Usando supabase por defecto');
  API_CONFIG.MODE = 'supabase';
}

export default API_CONFIG;
