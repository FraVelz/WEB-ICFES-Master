'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { AuthContextType } from './authTypes';
import { useAuthDemoMigration } from './authDemoMigration';
import { useAuthSession } from './useAuthSession';
import { useAuthMethods } from './useAuthMethods';

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
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { clearDemoMode, migrateDemoOnAuth } = useAuthDemoMigration();

  useAuthSession({ setUser, setLoading, clearDemoMode, migrateDemoOnAuth });

  const methods = useAuthMethods({ setUser, setError, clearDemoMode, migrateDemoOnAuth });

  const value: AuthContextType = {
    user,
    loading,
    error,
    ...methods,
    isAuthenticated: !!user,
    isAccountAuth: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
