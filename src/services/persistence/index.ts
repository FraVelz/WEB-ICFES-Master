/**
 * Capa de persistencia unificada: Supabase o localStorage según API_CONFIG.
 * Preferir estos módulos en hooks/UI en lugar de importar *SupabaseService y utilidades locales por separado.
 */
export * from './apiMode';
export * from './gamificationPersistence';
export * from './progressPersistence';
export * from './examPersistence';
export * from './userPersistence';
export { getAggregatedUserData } from './userDataBundle';
