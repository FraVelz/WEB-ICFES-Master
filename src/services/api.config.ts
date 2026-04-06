/**
 * Central API configuration
 * Single place for connection settings; switch between localStorage and Supabase.
 * Mode-dependent logic should use `@/services/persistence` (isSupabaseMode, etc.).
 */

// Tune for your environment (Next.js exposes NEXT_PUBLIC_* to the client)
const API_CONFIG = {
  // 'supabase' — Supabase (production)
  // 'localStorage' — local dev without a backend
  MODE: process.env.NEXT_PUBLIC_API_MODE || 'supabase',
};

// Validate configuration
const validModes = ['localStorage', 'supabase'];
if (!validModes.includes(API_CONFIG.MODE)) {
  console.warn('API_MODE inválido. Usando supabase por defecto');
  API_CONFIG.MODE = 'supabase';
}

export default API_CONFIG;
