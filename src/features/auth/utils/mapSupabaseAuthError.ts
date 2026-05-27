/**
 * Traduce mensajes típicos de Supabase Auth a español legible para el usuario.
 */
export const REQUIRES_EMAIL_CONFIRMATION = 'REQUIRES_EMAIL_CONFIRMATION';

export function mapSupabaseAuthError(err: unknown, fallback = 'Ha ocurrido un error. Intenta de nuevo.'): string {
  const raw = err instanceof Error ? err.message : typeof err === 'string' ? err : String(err);

  if (raw === REQUIRES_EMAIL_CONFIRMATION) {
    return 'Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.';
  }

  const lower = raw.toLowerCase();

  if (lower.includes('invalid login credentials') || lower.includes('invalid_credentials')) {
    return 'Correo o contraseña incorrectos.';
  }

  if (lower.includes('email not confirmed') || lower.includes('email_not_confirmed')) {
    return 'Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.';
  }

  if (lower.includes('user already registered') || lower.includes('already registered')) {
    return 'Este correo ya está registrado. Inicia sesión o usa “Olvidé mi contraseña”.';
  }

  if (lower.includes('password') && lower.includes('least')) {
    return 'La contraseña no cumple los requisitos de seguridad.';
  }

  if (lower.includes('signup') && lower.includes('disabled')) {
    return 'El registro con correo está desactivado. Contacta al administrador.';
  }

  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.';
  }

  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Error de conexión. Comprueba tu internet e inténtalo de nuevo.';
  }

  if (lower.includes('oauth_no_url')) {
    return 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.';
  }

  if (lower.includes('supabase no configurado')) {
    return 'Servicio de autenticación no configurado. Revisa las variables de entorno.';
  }

  return raw.length > 0 && raw.length < 200 ? raw : fallback;
}
