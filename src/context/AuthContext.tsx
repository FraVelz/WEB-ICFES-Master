import { createContext, useContext, useEffect, useState } from 'react';

/**
 * AuthContext - Versión local/visual sin backend
 * Usa localStorage para persistir sesión. Preparado para futura implementación de backend.
 */
const MOCK_USER_KEY = 'icfes_mock_user';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

const createMockUser = (overrides = {}) => ({
  uid: `user_${Date.now()}`,
  email: overrides.email || 'usuario@icfes.local',
  displayName: overrides.displayName || 'Usuario ICFES',
  photoURL: overrides.photoURL || null,
  ...overrides
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MOCK_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        const demoUser = createMockUser();
        localStorage.setItem(MOCK_USER_KEY, JSON.stringify(demoUser));
        setUser(demoUser);
      }
    } catch (e) {
      const demoUser = createMockUser();
      setUser(demoUser);
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, displayName) => {
    setError(null);
    const newUser = createMockUser({ email, displayName });
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const login = async (email, password) => {
    setError(null);
    const existing = localStorage.getItem(MOCK_USER_KEY);
    if (existing) {
      const parsed = JSON.parse(existing);
      setUser({ ...parsed, email: email || parsed.email });
      return parsed;
    }
    const newUser = createMockUser({ email });
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const loginWithGoogle = async () => {
    setError(null);
    const newUser = createMockUser({
      displayName: 'Usuario Google',
      email: 'google@icfes.local'
    });
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    setError(null);
    localStorage.removeItem(MOCK_USER_KEY);
    setUser(null);
  };

  const verifyEmailExists = async () => false;

  const resetPassword = async () => {
    setError(null);
    return true;
  };

  const getUserData = async (uid) => {
    const profile = JSON.parse(localStorage.getItem('icfes_user_profile') || '{}');
    const progress = JSON.parse(localStorage.getItem('icfes_progress') || 'null');
    const gamification = JSON.parse(localStorage.getItem('icfes_gamification') || '{}');
    return { profile, progress, gamification };
  };

  const getUserPlan = async () => {
    const plan = JSON.parse(localStorage.getItem('icfes_user_plan') || 'null');
    return plan || {
      planType: 'free',
      planName: 'Plan Gratuito',
      status: 'active',
      features: { questionsPerDay: 5, simulationTests: false, advancedAnalytics: false }
    };
  };

  const updateUserPlan = async (uid, planData) => {
    const current = JSON.parse(localStorage.getItem('icfes_user_plan') || '{}');
    const updated = { ...current, ...planData, updatedAt: new Date().toISOString() };
    localStorage.setItem('icfes_user_plan', JSON.stringify(updated));
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
    verifyEmailExists,
    getUserData,
    isAuthenticated: !!user,
    getUserPlan,
    updateUserPlan,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
