'use client';

import { useCallback } from 'react';
import { supabase } from '@/config/supabase';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { getAggregatedUserData } from '@/services/persistence';
import { setActiveStreakUserId } from '@/services/streak';
import { mapSupabaseAuthError, REQUIRES_EMAIL_CONFIRMATION } from '@/features/auth/utils/mapSupabaseAuthError';
import type { AuthContextType, AuthUser } from './authTypes';
import { mapSupabaseUser } from './authSupabase';

type AuthMethodsDeps = {
  setUser: (user: AuthUser | null) => void;
  setError: (error: string | null) => void;
  clearDemoMode: () => void;
  migrateDemoOnAuth: (userId: string) => Promise<void>;
};

export function useAuthMethods({
  setUser,
  setError,
  clearDemoMode,
  migrateDemoOnAuth,
}: AuthMethodsDeps): Omit<AuthContextType, 'user' | 'loading' | 'error' | 'isAuthenticated' | 'isAccountAuth'> {
  const signup = useCallback(
    async (email: string, password: string, displayName?: string): Promise<AuthUser | null> => {
      setError(null);
      if (!supabase) throw new Error('Supabase no configurado');
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (err) {
        const msg = mapSupabaseAuthError(err);
        setError(msg);
        throw new Error(msg);
      }
      if (!data.user) {
        const msg = mapSupabaseAuthError(new Error('Error en el registro'), 'No se pudo completar el registro.');
        setError(msg);
        throw new Error(msg);
      }
      if (!data.session) {
        setError(null);
        throw new Error(REQUIRES_EMAIL_CONFIRMATION);
      }
      try {
        await UserSupabaseService.createUser(data.user.id, {
          email: data.user.email,
          displayName: displayName || data.user.email?.split('@')[0],
          username: null,
          bio: null,
        });
      } catch (profileErr) {
        console.warn('Perfil tras registro (puede existir por trigger):', profileErr);
      }
      await migrateDemoOnAuth(data.user.id);
      clearDemoMode();
      return mapSupabaseUser(data.user);
    },
    [clearDemoMode, migrateDemoOnAuth, setError]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<AuthUser | null> => {
      setError(null);
      if (!supabase) throw new Error('Supabase no configurado');
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        const msg = mapSupabaseAuthError(err);
        setError(msg);
        throw new Error(msg);
      }
      await migrateDemoOnAuth(data.user.id);
      setActiveStreakUserId(data.user.id);
      clearDemoMode();
      return mapSupabaseUser(data.user);
    },
    [clearDemoMode, migrateDemoOnAuth, setError]
  );

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    if (!supabase) throw new Error('Supabase no configurado');
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { data, error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: origin ? `${origin}/auth/callback/?next=/ruta-aprendizaje` : undefined },
    });
    if (err) {
      const msg = mapSupabaseAuthError(err);
      setError(msg);
      throw new Error(msg);
    }
    if (data?.url) {
      window.location.href = data.url;
      return null;
    }
    const msg = mapSupabaseAuthError(new Error('oauth_no_url'), 'No se pudo iniciar sesión con Google.');
    setError(msg);
    throw new Error(msg);
  }, [setError]);

  const logout = useCallback(async (): Promise<void> => {
    setError(null);
    if (supabase) {
      await supabase.auth.signOut();
    }
    setActiveStreakUserId(null);
    setUser(null);
  }, [setError, setUser]);

  const resetPassword = useCallback(
    async (email: string): Promise<boolean> => {
      setError(null);
      if (!supabase) throw new Error('Supabase no configurado');
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });
      if (err) {
        const msg = mapSupabaseAuthError(err);
        setError(msg);
        throw new Error(msg);
      }
      return true;
    },
    [setError]
  );

  const updatePassword = useCallback(
    async (newPassword: string): Promise<boolean> => {
      setError(null);
      if (!supabase) throw new Error('Supabase no configurado');
      const { error: err } = await supabase.auth.updateUser({ password: newPassword });
      if (err) {
        const msg = mapSupabaseAuthError(err);
        setError(msg);
        throw new Error(msg);
      }
      return true;
    },
    [setError]
  );

  const verifyEmailExists = useCallback(async (): Promise<boolean> => false, []);

  const getUserData = useCallback(
    async (uid: string): Promise<Record<string, unknown>> => getAggregatedUserData(uid),
    []
  );

  return {
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updatePassword,
    verifyEmailExists,
    getUserData,
  };
}
