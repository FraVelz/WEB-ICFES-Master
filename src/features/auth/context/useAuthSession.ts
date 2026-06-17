'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { supabase } from '@/config/supabase';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { applyStoredReferralIfNeeded } from '@/services/referrals/applyStoredReferral';
import { setActiveStreakUserId } from '@/services/streak';
import { isSupabaseAuthConfigured } from '@/features/auth/utils/isSupabaseAuthConfigured';
import type { AuthUser } from './authTypes';
import { mapSupabaseUser, getOAuthProfileImage } from './authSupabase';

function isSameAuthUser(prev: AuthUser | null, next: AuthUser | null): boolean {
  if (prev === next) return true;
  if (!prev || !next) return false;
  return (
    prev.uid === next.uid &&
    prev.email === next.email &&
    prev.displayName === next.displayName &&
    prev.profileImage === next.profileImage
  );
}

function resolveAuthUser(sessionUser: Parameters<typeof mapSupabaseUser>[0]): AuthUser | null {
  return sessionUser ? mapSupabaseUser(sessionUser) : null;
}

type AuthSessionDeps = {
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
  setLoading: (loading: boolean) => void;
  clearDemoMode: () => void;
  migrateDemoOnAuth: (userId: string) => Promise<void>;
};

export function useAuthSession({ setUser, setLoading, clearDemoMode, migrateDemoOnAuth }: AuthSessionDeps) {
  useEffect(() => {
    if (!isSupabaseAuthConfigured() || !supabase) {
      setUser(null);
      setLoading(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const nextUser = resolveAuthUser(session?.user ?? null);
      setUser((prev) => (isSameAuthUser(prev, nextUser) ? prev : nextUser));
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        await migrateDemoOnAuth(session.user.id);
        clearDemoMode();
        try {
          const existing = await UserSupabaseService.getByUserId(session.user.id);
          if (!existing) {
            const meta = session.user.user_metadata;
            const displayName = meta?.display_name || meta?.full_name || session.user.email?.split('@')[0] || 'Usuario';
            await UserSupabaseService.createUser(session.user.id, {
              email: session.user.email,
              displayName,
              profileImage: getOAuthProfileImage(session.user),
            });
            await applyStoredReferralIfNeeded(session.user.id, 'web');
          }
        } catch (profileErr) {
          console.warn('Perfil tras inicio de sesión (puede existir por trigger):', profileErr);
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const nextUser = resolveAuthUser(session?.user ?? null);
      setUser((prev) => (isSameAuthUser(prev, nextUser) ? prev : nextUser));
      if (session?.user) {
        setActiveStreakUserId(session.user.id);
        clearDemoMode();
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, [clearDemoMode, migrateDemoOnAuth, setLoading, setUser]);
}
