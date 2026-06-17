'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useAuth } from '@/features/auth/context/AuthContext';
import { getSiteUrl } from '@/config/site';
import { getReferralCodeForUser } from '@/services/referrals/referralService';
import { SettingsSection } from './SettingsSection';

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function SettingsInvitePanel() {
  const { user } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    void (async () => {
      setLoading(true);
      const referralCode = await getReferralCodeForUser(user.uid);
      setCode(referralCode);
      setLoading(false);
    })();
  }, [user?.uid]);

  const inviteLink = code ? `${getSiteUrl()}/signup/?ref=${encodeURIComponent(code)}` : '';

  const handleCopy = useCallback(async (value: string, kind: 'code' | 'link') => {
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleShare = useCallback(async () => {
    if (!code || !inviteLink) return;
    const text = `¡Únete a ICFES Master con mi enlace y prepárate para el ICFES! ${inviteLink}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'ICFES Master', text, url: inviteLink });
        return;
      } catch {
        /* usuario canceló */
      }
    }
    await handleCopy(inviteLink, 'link');
  }, [code, inviteLink, handleCopy]);

  if (!user?.uid) return null;

  return (
    <SettingsSection title="Invitar amigos" icon="user-plus">
      <p className="text-on-surface-muted text-sm leading-relaxed">
        Comparte tu enlace. Cuando un amigo se registre y complete su primera lección, recibirás{' '}
        <span className="text-on-surface font-semibold">300 XP</span> y{' '}
        <span className="text-on-surface font-semibold">150 monedas</span>. También desbloquearás logros al invitar más
        amigos.
      </p>

      {loading ? (
        <p className="text-on-surface-muted text-sm">Cargando tu código…</p>
      ) : code ? (
        <div className="space-y-4">
          <div>
            <p className="text-on-surface-muted mb-2 text-xs font-semibold tracking-wide uppercase">Tu código</p>
            <div
              className={cn(
                'border-surface-border bg-surface/50 flex items-center gap-2 rounded-xl border px-3 py-2.5'
              )}
            >
              <span className="text-on-surface flex-1 font-mono text-lg font-bold tracking-widest">{code}</span>
              <button
                type="button"
                onClick={() => void handleCopy(code, 'code')}
                className="text-app-accent hover:text-on-surface text-sm font-semibold"
              >
                {copied === 'code' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleCopy(inviteLink, 'link')}
              className={cn(
                'border-surface-border bg-surface-elevated text-on-surface inline-flex items-center gap-2',
                'rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-overlay'
              )}
            >
              <Icon name="link" />
              {copied === 'link' ? 'Enlace copiado' : 'Copiar enlace'}
            </button>
            <button
              type="button"
              onClick={() => void handleShare()}
              className={cn(
                'bg-app-accent inline-flex items-center gap-2 rounded-lg px-4 py-2.5',
                'text-sm font-semibold text-white transition-opacity hover:opacity-90'
              )}
            >
              <Icon name="share-alt" />
              Compartir
            </button>
          </div>
        </div>
      ) : (
        <p className="text-on-surface-muted text-sm">No se pudo cargar tu código de invitación.</p>
      )}
    </SettingsSection>
  );
}
