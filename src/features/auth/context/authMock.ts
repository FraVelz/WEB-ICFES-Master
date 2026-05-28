import type { AuthUser } from './authTypes';

export const MOCK_USER_KEY = 'icfes_mock_user';

export const createMockUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  uid: `user_${Date.now()}`,
  id: `user_${Date.now()}`,
  email: overrides.email ?? 'usuario@icfes.local',
  displayName: overrides.displayName ?? 'Usuario ICFES',
  photoURL: overrides.photoURL ?? null,
  ...overrides,
});

export function loadMockUserFromStorage(): AuthUser | null {
  try {
    const stored = typeof window !== 'undefined' && localStorage.getItem(MOCK_USER_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function persistMockUser(user: AuthUser): void {
  if (typeof window !== 'undefined') localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
}

export function clearMockUser(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(MOCK_USER_KEY);
}
