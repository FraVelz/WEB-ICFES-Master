'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import API_CONFIG from '@/services/api.config';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

const MOCK_USER_KEY = 'icfes_mock_user';

const createMockUser = (overrides = {}) => ({
  uid: `user_${Date.now()}`,
  id: `user_${Date.now()}`,
  email: overrides.email || 'usuario@icfes.local',
  displayName: overrides.displayName || 'Usuario ICFES',
  photoURL: overrides.photoURL || null,
  ...overrides
});

const mapSupabaseUser = (user) => {
  if (!user) return null;
  return {
    uid: user.id,
    id: user.id,
    email: user.email,
    displayName: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
    photoURL: user.user_metadata?.avatar_url || user.user_metadata?.picture || null
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    setError(null);
    if (API_CONFIG.MODE !== 'supabase') {
      const newUser = createMockUser({ email, displayName });
      if (typeof window !== 'undefined') localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    }
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } }
    });
    if (err) {
      setError(err.message);
      throw err;
    }
    if (data.user) {
      await UserSupabaseService.createUser(data.user.id, {
        email: data.user.email,
        displayName: displayName || data.user.email?.split('@')[0],
        username: null,
        bio: null
      });
      return mapSupabaseUser(data.user);
    }
    throw new Error('Error en el registro');
  };

  const login = async (email, password) => {
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
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      throw err;
    }
    return mapSupabaseUser(data.user);
  };

  const loginWithGoogle = async () => {
    setError(null);
    if (API_CONFIG.MODE !== 'supabase') {
      const newUser = createMockUser({ displayName: 'Usuario Google', email: 'google@icfes.local' });
      if (typeof window !== 'undefined') localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    }
    const { data, error: err } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (err) {
      setError(err.message);
      throw err;
    }
    if (data?.url) {
      window.location.href = data.url;
      return null;
    }
    throw new Error('Error al iniciar con Google');
  };

  const logout = async () => {
    setError(null);
    if (API_CONFIG.MODE === 'supabase') {
      await supabase.auth.signOut();
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem(MOCK_USER_KEY);
    }
    setUser(null);
  };

  const verifyEmailExists = async () => false;

  const resetPassword = async (email) => {
    setError(null);
    if (API_CONFIG.MODE !== 'supabase') {
      return true;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`
    });
    if (err) {
      setError(err.message);
      throw err;
    }
    return true;
  };

  const updatePassword = async (newPassword) => {
    setError(null);
    if (API_CONFIG.MODE !== 'supabase') {
      return true;
    }
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (err) {
      setError(err.message);
      throw err;
    }
    return true;
  };

  const getUserData = async (uid) => {
    if (API_CONFIG.MODE !== 'supabase') {
      const profile = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('icfes_user_profile') || '{}') : {};
      const progress = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('icfes_progress') || 'null') : null;
      const gamification = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('icfes_gamification') || '{}') : {};
      return { profile, progress, gamification };
    }
    const profile = await UserSupabaseService.getByUserId(uid);
    const { ProgressSupabaseService } = await import('@/services/supabase');
    const { GamificationSupabaseService } = await import('@/services/supabase');
    const [progress, gamification] = await Promise.all([
      ProgressSupabaseService.getByUserId(uid),
      GamificationSupabaseService.getByUserId(uid)
    ]);
    return { profile, progress, gamification };
  };

  const getUserPlan = async () => {
    const defaultPlan = {
      planType: 'free',
      planName: 'Plan Gratuito',
      status: 'active',
      features: { questionsPerDay: 5, simulationTests: false, advancedAnalytics: false }
    };
    if (API_CONFIG.MODE !== 'supabase') {
      const plan = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('icfes_user_plan') || 'null') : null;
      return plan || defaultPlan;
    }
    const { supabase: sb } = await import('@/config/supabase');
    const { data: { user: authUser } } = await sb.auth.getUser();
    if (!authUser) return { planType: 'free', planName: 'Plan Gratuito', status: 'active', features: {} };
    const { data } = await sb.from('user_plans').select('*').eq('user_id', authUser.id).maybeSingle();
    if (data) {
      return {
        planType: data.plan_type || 'free',
        planName: data.plan_name || 'Plan Gratuito',
        status: data.status || 'active',
        features: data.features || {}
      };
    }
    return defaultPlan;
  };

  const updateUserPlan = async (uid, planData) => {
    if (API_CONFIG.MODE !== 'supabase') {
      const current = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('icfes_user_plan') || '{}') : {};
      const updated = { ...current, ...planData, updatedAt: new Date().toISOString() };
      if (typeof window !== 'undefined') localStorage.setItem('icfes_user_plan', JSON.stringify(updated));
      return;
    }
    const { supabase: sb } = await import('@/config/supabase');
    await sb.from('user_plans').upsert({
      user_id: uid,
      plan_type: planData.planType || planData.plan_type,
      plan_name: planData.planName || planData.plan_name,
      status: planData.status || 'active',
      features: planData.features || {},
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
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
