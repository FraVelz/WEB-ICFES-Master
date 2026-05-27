import { describe, expect, it } from 'vitest';

import { mapSupabaseAuthError } from '@/features/auth/utils/mapSupabaseAuthError';

describe('mapSupabaseAuthError', () => {
  it('traduce credenciales inválidas', () => {
    expect(mapSupabaseAuthError(new Error('Invalid login credentials'))).toBe('Correo o contraseña incorrectos.');
  });

  it('usa fallback para errores desconocidos largos', () => {
    const long = 'x'.repeat(250);
    expect(mapSupabaseAuthError(new Error(long), 'Fallo genérico')).toBe('Fallo genérico');
  });
});
