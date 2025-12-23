/**
 * CONFIGURACIÓN CENTRAL DE API
 * Este archivo centraliza toda la configuración de conexión
 * Permite cambiar fácilmente entre localStorage (desarrollo) y backend API (producción)
 */

// Cambiar estos valores según el ambiente
const API_CONFIG = {
  // 'localStorage' para desarrollo local
  // 'api' para conectarse a un backend
  MODE: import.meta.env.VITE_API_MODE || 'localStorage',
  
  // URL del backend (cuando estés listo para conectar)
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  
  // Token para autenticación (cuando implementes)
  API_TOKEN: import.meta.env.VITE_API_TOKEN || null,
  
  // Timeouts y configuración
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3
};

// Validar configuración
if (API_CONFIG.MODE !== 'localStorage' && API_CONFIG.MODE !== 'api') {
  console.warn('API_MODE inválido. Usando localStorage por defecto');
  API_CONFIG.MODE = 'localStorage';
}

export default API_CONFIG;
