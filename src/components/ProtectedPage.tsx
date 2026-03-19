'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SignInRequiredBlock from './SignInRequiredBlock';

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const auth = useAuth() as { isAuthenticated: boolean; loading: boolean };
  const { isAuthenticated, loading } = auth;
  const router = useRouter();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDemoMode(localStorage.getItem('demoMode') === 'true');
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    if (!loading && checked && !isAuthenticated && !isDemoMode) {
      router.replace('/login');
    }
  }, [loading, checked, isAuthenticated, isDemoMode, router]);

  if (loading || !checked) {
    return (
      <div className="flex flex-col min-h-dvh bg-linear-to-b from-black via-slate-950 to-black text-white items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-lg font-semibold text-cyan-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && isDemoMode) {
    return <SignInRequiredBlock />;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
