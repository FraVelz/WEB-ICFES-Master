import type { AuthUser, SupabaseUserLike } from './authTypes';

export const mapSupabaseUser = (user: SupabaseUserLike | null): AuthUser | null => {
  if (!user) return null;
  return {
    uid: user.id,
    id: user.id,
    email: user.email ?? null,
    displayName:
      user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
    photoURL: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
  };
};
