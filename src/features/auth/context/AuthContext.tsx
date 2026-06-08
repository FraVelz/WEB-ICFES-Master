'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/config/supabase';
import { useUiSessionStore } from '@/store/uiSessionStore';
import API_CONFIG from '@/services/api.config';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { getAggregatedUserData } from '@/services/persistence';
import { mergeDemoStreakIntoUser, setActiveStreakUserId, STREAK_UPDATED_EVENT } from '@/services/streak';
import { normalizePlanFeatures } from '@/shared/constants/planFeatures';
import { mapSupabaseAuthError, REQUIRES_EMAIL_CONFIRMATION } from '@/features/auth/utils/mapSupabaseAuthError';
import type { AuthContextType, AuthUser, PlanData } from './authTypes';
import { clearMockUser, createMockUser, loadMockUserFromStorage, persistMockUser } from './authMock';
import { mapSupabaseUser } from './authSupabase';

export type { AuthUser, PlanData } from './authTypes';

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

  const migrateStreakOnAuth = useCallback(async (userId: string) => {
    try {
      await mergeDemoStreakIntoUser(userId);
      setActiveStreakUserId(userId);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(STREAK_UPDATED_EVENT));
      }
    } catch (err) {
      console.warn('No se pudo migrar la racha del demo:', err);
    }
  }, []);

  useEffect(() => {
    if (API_CONFIG.MODE !== 'supabase' || !process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
      setUser(loadMockUserFromStorage());
      setLoading(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        await migrateStreakOnAuth(session.user.id);
        clearDemoMode();
        try {
          const existing = await UserSupabaseService.getByUserId(session.user.id);
          if (!existing) {
            const meta = session.user.user_metadata;
            await UserSupabaseService.createUser(session.user.id, {
              email: session.user.email,
              displayName: meta?.display_name || meta?.full_name || session.user.email?.split('@')[0] || 'Usuario',
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
  }, [clearDemoMode, migrateStreakOnAuth]);

  const signup = async (email: string, password: string, displayName?: string): Promise<AuthUser | null> => {
    setError(null);
    if (API_CONFIG.MODE !== 'supabase') {
      const newUser = createMockUser({ email, displayName });
      persistMockUser(newUser);
      setUser(newUser);
      await migrateStreakOnAuth(newUser.uid);
      clearDemoMode();
      return newUser;
    }
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
    await migrateStreakOnAuth(data.user.id);
    clearDemoMode();
    return mapSupabaseUser(data.user);
  };

  const login = async (email: string, password: string): Promise<AuthUser | null> => {
    setError(null);
    if (API_CONFIG.MODE !== 'supabase') {
      const existing = loadMockUserFromStorage();
      if (existing) {
        const updated = { ...existing, email: email || existing.email };
        persistMockUser(updated);
        setUser(updated);
        await migrateStreakOnAuth(updated.uid);
        clearDemoMode();
        return updated;
      }
      const newUser = createMockUser({ email });
      persistMockUser(newUser);
      setUser(newUser);
      await migrateStreakOnAuth(newUser.uid);
      clearDemoMode();
      return newUser;
    }
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      const msg = mapSupabaseAuthError(err);
      setError(msg);
      throw new Error(msg);
    }
    await migrateStreakOnAuth(data.user.id);
    setActiveStreakUserId(data.user.id);
    clearDemoMode();
    return mapSupabaseUser(data.user);
  };

  const loginWithGoogle = async () => {
    setError(null);
    if (API_CONFIG.MODE !== 'supabase') {
      const newUser = createMockUser({ displayName: 'Usuario Google', email: 'google@icfes.local' });
      persistMockUser(newUser);
      setUser(newUser);
      await migrateStreakOnAuth(newUser.uid);
      clearDemoMode();
      return newUser;
    }
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
    if (API_CONFIG.MODE === 'supabase' && supabase) {
      await supabase.auth.signOut();
    } else {
      clearMockUser();
    }
    setActiveStreakUserId(null);
    setUser(null);
  };

  const verifyEmailExists = async (): Promise<boolean> => false;

  const resetPassword = async (email: string): Promise<boolean> => {
    setError(null);
    if (API_CONFIG.MODE !== 'supabase') return true;
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
    if (API_CONFIG.MODE !== 'supabase') return true;
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

  const getUserPlan = async (): Promise<Record<string, unknown>> => {
    const defaultPlan = {
      planType: 'free',
      planName: 'Plan Gratuito',
      status: 'active',
      features: { questionsPerDay: 5, simulationTests: false, advancedAnalytics: false },
    };
    if (API_CONFIG.MODE !== 'supabase') {
      const plan = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('icfes_user_plan') || 'null') : null;
      return plan || defaultPlan;
    }
    const { supabase: sb } = await import('@/config/supabase');
    if (!sb) return defaultPlan;
    const {
      data: { user: authUser },
    } = await sb.auth.getUser();
    if (!authUser) return { planType: 'free', planName: 'Plan Gratuito', status: 'active', features: {} };
    const { data } = await sb.from('user_plans').select('*').eq('user_id', authUser.id).maybeSingle();
    if (data) {
      return {
        planType: data.plan_type || 'free',
        planName: data.plan_name || 'Plan Gratuito',
        status: data.status || 'active',
        features: normalizePlanFeatures(data.features, data.plan_type),
      };
    }
    return defaultPlan;
  };

  const updateUserPlan = async (uid: string, planData: PlanData): Promise<void> => {
    if (API_CONFIG.MODE !== 'supabase') {
      const current = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('icfes_user_plan') || '{}') : {};
      const updated = { ...current, ...planData, updatedAt: new Date().toISOString() };
      if (typeof window !== 'undefined') localStorage.setItem('icfes_user_plan', JSON.stringify(updated));
      return;
    }
    const { supabase: sb } = await import('@/config/supabase');
    if (!sb) return;
    await sb.from('user_plans').upsert(
      {
        user_id: uid,
        plan_type: planData.planType || planData.plan_type,
        plan_name: planData.planName || planData.plan_name,
        status: planData.status || 'active',
        features: normalizePlanFeatures(planData.features, planData.planType ?? planData.plan_type),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
  };

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
    getUserPlan,
    updateUserPlan,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
