'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export const DemoRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setIsDemoMode(localStorage.getItem('demoMode') === 'true');
    setChecked(true);
  }, []);
  useEffect(() => {
    if (!loading && checked && !isAuthenticated && !isDemoMode)
      router.replace('/login');
  }, [loading, checked, isAuthenticated, isDemoMode, router]);
  if (loading || !checked || (!isAuthenticated && !isDemoMode)) return null;
  return children;
};
