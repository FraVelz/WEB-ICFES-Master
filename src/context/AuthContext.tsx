'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import API_CONFIG from '@/services/api.config';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { getAggregatedUserData } from '@/services/persistence';
import { mapSupabaseAuthError, REQUIRES_EMAIL_CONFIRMATION } from '@/utils/mapSupabaseAuthError';

export interface AuthUser {
  uid: string;
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface PlanData {
  planType?: string;
  plan_type?: string;
  planName?: string;
  plan_name?: string;
  status?: string;
  features?: Record<string, unknown>;
}

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signup: (email: string, password: string, displayName?: string) => Promise<AuthUser | null>;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  loginWithGoogle: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  verifyEmailExists: () => Promise<boolean>;
  getUserData: (uid: string) => Promise<Record<string, unknown>>;
  getUserPlan: () => Promise<Record<string, unknown>>;
  updateUserPlan: (uid: string, planData: PlanData) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

const MOCK_USER_KEY = 'icfes_mock_user';

const createMockUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  uid: `user_${Date.now()}`,
  id: `user_${Date.now()}`,
  email: overrides.email ?? 'usuario@icfes.local',
  displayName: overrides.displayName ?? 'Usuario ICFES',
  photoURL: overrides.photoURL ?? null,
  ...overrides,
});

interface SupabaseUserLike {
  id: string;
  email?: string | null;
  user_metadata?: {
    display_name?: string;
    full_name?: string;
    avatar_url?: string;
    picture?: string;
  };
}

const mapSupabaseUser = (user: SupabaseUserLike | null): AuthUser | null => {
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (API_CONFIG.MODE !== 'supabase' || !process.env.NEXT_PUBLIC_SUPABASE_URL || !supabase) {
      try {
        const stored = typeof window !== 'undefined' && localStorage.getItem(MOCK_USER_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          const demoUser = createMockUser();
          if (typeof window !== 'undefined') localStorage.setItem(MOCK_USER_KEY, JSON.stringify(demoUser));
          setUser(demoUser);
        }
      } catch {
        setUser(createMockUser());
      }
      setLoading(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signup = async (email: string, password: string, displayName?: string): Promise<AuthUser | null> => {
    setError(null);
    if (API_CONFIG.MODE !== 'supabase') {
      const newUser = createMockUser({ email, displayName });
      if (typeof window !== 'undefined') localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
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

    // Confirmación por correo: sin sesión aún; el trigger en BD crea public.users al insertar en auth.users
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
    return mapSupabaseUser(data.user);
  };

  const login = async (email: string, password: string): Promise<AuthUser | null> => {
    setError(null);
    if (API_CONFIG.MODE !== 'supabase') {
      const existing = typeof window !== 'undefined' && localStorage.getItem(MOCK_USER_KEY);
      if (existing) {
        const parsed = JSON.parse(existing);
        setUser({ ...parsed, email: email || parsed.email });
        return parsed;
      }
      const newUser = createMockUser({ email });
      if (typeof window !== 'undefined') localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    }
    if (!supabase) throw new Error('Supabase no configurado');
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (err) {
      const msg = mapSupabaseAuthError(err);
      setError(msg);
      throw new Error(msg);
    }
    return mapSupabaseUser(data.user);
  };

  const loginWithGoogle = async () => {
    setError(null);
    if (API_CONFIG.MODE !== 'supabase') {
      const newUser = createMockUser({
        displayName: 'Usuario Google',
        email: 'google@icfes.local',
      });
      if (typeof window !== 'undefined') localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    }
    if (!supabase) throw new Error('Supabase no configurado');
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { data, error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: origin ? `${origin}/ruta-aprendizaje` : undefined,
      },
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
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem(MOCK_USER_KEY);
    }
    setUser(null);
  };

  const verifyEmailExists = async (): Promise<boolean> => false;

  const resetPassword = async (email: string): Promise<boolean> => {
    setError(null);
    if (API_CONFIG.MODE !== 'supabase') {
      return true;
    }
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
    if (API_CONFIG.MODE !== 'supabase') {
      return true;
    }
    if (!supabase) throw new Error('Supabase no configurado');
    const { error: err } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (err) {
      const msg = mapSupabaseAuthError(err);
      setError(msg);
      throw new Error(msg);
    }
    return true;
  };

  const getUserData = async (uid: string): Promise<Record<string, unknown>> => {
    return getAggregatedUserData(uid);
  };

  const getUserPlan = async (): Promise<Record<string, unknown>> => {
    const defaultPlan = {
      planType: 'free',
      planName: 'Plan Gratuito',
      status: 'active',
      features: {
        questionsPerDay: 5,
        simulationTests: false,
        advancedAnalytics: false,
      },
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
    if (!authUser)
      return {
        planType: 'free',
        planName: 'Plan Gratuito',
        status: 'active',
        features: {},
      };
    const { data } = await sb.from('user_plans').select('*').eq('user_id', authUser.id).maybeSingle();
    if (data) {
      return {
        planType: data.plan_type || 'free',
        planName: data.plan_name || 'Plan Gratuito',
        status: data.status || 'active',
        features: data.features || {},
      };
    }
    return defaultPlan;
  };

  const updateUserPlan = async (uid: string, planData: PlanData): Promise<void> => {
    if (API_CONFIG.MODE !== 'supabase') {
      const current = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('icfes_user_plan') || '{}') : {};
      const updated = {
        ...current,
        ...planData,
        updatedAt: new Date().toISOString(),
      };
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
        features: planData.features || {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
  };

  const value = {
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
    getUserPlan,
    updateUserPlan,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
