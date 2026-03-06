'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DemoProtectedPage({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const demo = localStorage.getItem('demoMode') === 'true';
    setIsDemoMode(demo);
    setChecked(true);
  }, []);

  useEffect(() => {
    if (!loading && checked && !isAuthenticated && !isDemoMode) {
      router.replace('/login');
    }
  }, [loading, checked, isAuthenticated, isDemoMode, router]);

  if (loading || !checked) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-gradient-to-b from-black via-slate-950 to-black text-white items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-lg font-semibold text-cyan-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isDemoMode) return null;

  return <>{children}</>;
}
