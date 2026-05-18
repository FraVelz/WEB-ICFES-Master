'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { supabase } from '@/config/supabase';
import { AUTH_DEFAULT_REDIRECT } from '@/features/auth/constants/authRoutes';

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Completando inicio de sesión...');

  useEffect(() => {
    const next = searchParams.get('next') || AUTH_DEFAULT_REDIRECT;

    if (!supabase) {
      setMessage('Supabase no configurado.');
      router.replace('/login');
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const redirectWhenReady = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      if (session) {
        router.replace(next);
        return;
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, sess) => {
        if (sess && !cancelled) {
          subscription.unsubscribe();
          router.replace(next);
        }
      });

      const timeout = window.setTimeout(() => {
        if (!cancelled) {
          subscription.unsubscribe();
          setMessage('No se pudo completar el inicio de sesión.');
          router.replace('/login');
        }
      }, 10000);

      cleanup = () => {
        window.clearTimeout(timeout);
        subscription.unsubscribe();
      };
    };

    void redirectWhenReady();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [router, searchParams]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-linear-to-b from-black via-slate-950 to-black px-6 text-white">
      <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-app-ring/30 border-t-app-ring" />
      <p className="text-center text-slate-300">{message}</p>
    </div>
  );
}
