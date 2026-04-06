/**
 * Modo de persistencia: Supabase (producción) o localStorage (desarrollo sin backend).
 * Configuración: src/services/api.config.ts (NEXT_PUBLIC_API_MODE).
 */
import API_CONFIG from '../api.config';

export { API_CONFIG };

export function isSupabaseMode(): boolean {
  return API_CONFIG.MODE === 'supabase';
}

export function isLocalStorageMode(): boolean {
  return API_CONFIG.MODE === 'localStorage';
}
