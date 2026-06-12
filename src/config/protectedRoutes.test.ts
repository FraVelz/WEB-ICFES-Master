import { describe, expect, it } from 'vitest';
import { isProtectedDashboardPath } from './protectedRoutes';

describe('isProtectedDashboardPath', () => {
  it('protects dashboard routes', () => {
    expect(isProtectedDashboardPath('/ruta-aprendizaje/')).toBe(true);
    expect(isProtectedDashboardPath('/ruta-al-500/')).toBe(true);
    expect(isProtectedDashboardPath('/logros')).toBe(true);
    expect(isProtectedDashboardPath('/tienda/')).toBe(true);
  });

  it('allows public profile', () => {
    expect(isProtectedDashboardPath('/perfil/public/')).toBe(false);
    expect(isProtectedDashboardPath('/perfil/public')).toBe(false);
  });

  it('allows public pages', () => {
    expect(isProtectedDashboardPath('/')).toBe(false);
    expect(isProtectedDashboardPath('/login/')).toBe(false);
  });
});
