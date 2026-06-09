'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/config/supabase';
import { useUiSessionStore } from '@/store/uiSessionStore';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { getAggregatedUserData, mergeDemoIntoUser } from '@/services/persistence';
import { setActiveStreakUserId, STREAK_UPDATED_EVENT } from '@/services/streak';
import { mapSupabaseAuthError, REQUIRES_EMAIL_CONFIRMATION } from '@/features/auth/utils/mapSupabaseAuthError';
import { isSupabaseAuthConfigured } from '@/features/auth/utils/isSupabaseAuthConfigured';
import type { AuthContextType, AuthUser } from './authTypes';
import { mapSupabaseUser, getOAuthProfileImage } from './authSupabase';

export type { AuthUser } from './authTypes';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearDemoMode = useCallback(() => {
    useUiSessionStore.getState().setDemoMode(false);
  }, []);

  const migrateDemoOnAuth = useCallback(async (userId: string) => {
    try {
      await mergeDemoIntoUser(userId);
      setActiveStreakUserId(userId);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(STREAK_UPDATED_EVENT));
      }
    } catch (err) {
      console.warn('No se pudo migrar el progreso del demo:', err);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseAuthConfigured() || !supabase) {
      setUser(null);
      setLoading(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        await migrateDemoOnAuth(session.user.id);
        clearDemoMode();
        try {
          const existing = await UserSupabaseService.getByUserId(session.user.id);
          if (!existing) {
            const meta = session.user.user_metadata;
            await UserSupabaseService.createUser(session.user.id, {
              email: session.user.email,
              displayName: meta?.display_name || meta?.full_name || session.user.email?.split('@')[0] || 'Usuario',
              profileImage: getOAuthProfileImage(session.user),
            });
          }
        } catch (profileErr) {
          console.warn('Perfil tras inicio de sesión (puede existir por trigger):', profileErr);
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      if (session?.user) {
        setActiveStreakUserId(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, [clearDemoMode, migrateDemoOnAuth]);

  const signup = async (email: string, password: string, displayName?: string): Promise<AuthUser | null> => {
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
  };

  const login = async (email: string, password: string): Promise<AuthUser | null> => {
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
  };

  const loginWithGoogle = async () => {
    setError(null);
    if (!supabase) throw new Error('Supabase no configurado');
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { data, error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: origin ? `${origin}/auth/callback?next=/ruta-aprendizaje` : undefined },
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
  };

  const logout = async (): Promise<void> => {
    setError(null);
    if (supabase) {
      await supabase.auth.signOut();
    }
    setActiveStreakUserId(null);
    setUser(null);
  };

  const verifyEmailExists = async (): Promise<boolean> => false;

  const resetPassword = async (email: string): Promise<boolean> => {
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
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    setError(null);
    if (!supabase) throw new Error('Supabase no configurado');
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (err) {
      const msg = mapSupabaseAuthError(err);
      setError(msg);
      throw new Error(msg);
    }
    return true;
  };

  const getUserData = async (uid: string): Promise<Record<string, unknown>> => getAggregatedUserData(uid);

  const value: AuthContextType = {
    user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updatePassword,
    verifyEmailExists,
    getUserData,
    isAuthenticated: !!user,
    isAccountAuth: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
