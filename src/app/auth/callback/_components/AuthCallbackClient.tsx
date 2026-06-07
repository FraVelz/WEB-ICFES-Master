'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { supabase } from '@/config/supabase';
import { AUTH_DEFAULT_REDIRECT } from '@/features/auth/constants/authRoutes';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { cn } from '@/utils/cn';

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Completando inicio de sesión...');

  useEffect(() => {
    const next = searchParams.get('next') || AUTH_DEFAULT_REDIRECT;
    const client = supabase;

    if (!client) {
      setMessage('Supabase no configurado.');
      router.replace('/login');
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const redirectWhenReady = async () => {
      const {
        data: { session },
      } = await client.auth.getSession();

      if (cancelled) return;

      if (session) {
        router.replace(next);
        return;
      }

      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, sess) => {
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
    <div className={cn('flex flex-col items-center justify-center px-6', FULL_PAGE_SHELL_CLASS)}>
      <div className="border-app-ring/30 border-t-app-ring mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4" />
      <p className="text-center text-on-surface-muted">{message}</p>
    </div>
  );
}
