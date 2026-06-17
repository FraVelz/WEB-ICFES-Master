'use client';

import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useAuth } from '@/features/auth/context/AuthContext';
import { getSiteUrl } from '@/config/site';
import {
  applyReferralCode,
  getInviteeReferralStatus,
} from '@/services/referrals/referralService';
import { SettingsSection } from './SettingsSection';

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function buildInviteMessage(code: string, inviteLink: string): string {
  return `¡Únete a ICFES Master y prepárate para el ICFES! Código: ${code}\n${inviteLink}`;
}

export function SettingsInvitePanel() {
  const { user } = useAuth();
  const [code, setCode] = useState<string | null>(null);
  const [hasReferrer, setHasReferrer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inviteFeedback, setInviteFeedback] = useState<'shared' | 'copied' | null>(null);

  const [friendCode, setFriendCode] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyFeedback, setApplyFeedback] = useState<'success' | 'invalid' | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    void (async () => {
      setLoading(true);
      const status = await getInviteeReferralStatus(user.uid);
      setCode(status.referralCode);
      setHasReferrer(Boolean(status.referredBy));
      setLoading(false);
    })();
  }, [user?.uid]);

  const inviteLink = code ? `${getSiteUrl()}/signup/?ref=${encodeURIComponent(code)}` : '';

  const handleInviteFriend = useCallback(async () => {
    if (!code || !inviteLink) return;
    const message = buildInviteMessage(code, inviteLink);

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'ICFES Master',
          text: message,
          url: inviteLink,
        });
        setInviteFeedback('shared');
        window.setTimeout(() => setInviteFeedback(null), 2500);
        return;
      } catch {
        /* usuario canceló o no disponible */
      }
    }

    const ok = await copyText(message);
    if (!ok) return;
    setInviteFeedback('copied');
    window.setTimeout(() => setInviteFeedback(null), 2500);
  }, [code, inviteLink]);

  const handleApplyFriendCode = useCallback(async () => {
    if (!user?.uid || hasReferrer) return;
    const normalized = friendCode.trim().toUpperCase();
    if (!normalized) return;

    setApplyLoading(true);
    setApplyFeedback(null);
    const applied = await applyReferralCode(user.uid, normalized, 'web');
    setApplyLoading(false);

    if (applied) {
      setHasReferrer(true);
      setFriendCode('');
      setApplyFeedback('success');
      return;
    }

    setApplyFeedback('invalid');
  }, [user?.uid, hasReferrer, friendCode]);

  if (!user?.uid) return null;

  return (
    <SettingsSection title="Invitar amigos" icon="share-nodes">
      <div className="space-y-6">
        <div className="border-surface-border/80 space-y-4 rounded-xl border p-4">
          <div>
            <h3 className="text-on-surface text-sm font-bold">Invita a tus amigos</h3>
            <p className="text-on-surface-muted mt-1 text-sm leading-relaxed">
              Cuando alguien se registre con tu invitación y complete su primera lección, recibirás{' '}
              <span className="text-on-surface font-semibold">300 XP</span> y{' '}
              <span className="text-on-surface font-semibold">150 monedas</span>.
            </p>
          </div>

          {loading ? (
            <p className="text-on-surface-muted text-sm">Cargando tu código…</p>
          ) : code ? (
            <div className="space-y-3">
              <div>
                <p className="text-on-surface-muted mb-2 text-xs font-semibold tracking-wide uppercase">Tu código</p>
                <p className="text-on-surface border-surface-border bg-surface/50 rounded-xl border px-4 py-3 font-mono text-xl font-bold tracking-widest">
                  {code}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void handleInviteFriend()}
                className={cn(
                  'inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3',
                  'from-app-accent-strong bg-linear-to-r to-blue-600 text-sm font-bold text-white',
                  'transition-opacity hover:opacity-90',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
                )}
              >
                <Icon name="share-nodes" size="sm" />
                {inviteFeedback === 'shared'
                  ? '¡Listo!'
                  : inviteFeedback === 'copied'
                    ? 'Invitación copiada'
                    : 'Invitar amigo'}
              </button>
              <p className="text-on-surface-muted text-center text-xs leading-relaxed">
                Comparte tu enlace con un toque o, si tu navegador no lo permite, copiamos el mensaje por ti.
              </p>
            </div>
          ) : (
            <p className="text-on-surface-muted text-sm">No se pudo cargar tu código de invitación.</p>
          )}
        </div>

        <div className="border-surface-border/80 space-y-4 rounded-xl border p-4">
          <div>
            <h3 className="text-on-surface text-sm font-bold">¿Te invitó un amigo?</h3>
            <p className="text-on-surface-muted mt-1 text-sm leading-relaxed">
              Si alguien te compartió su código, ingrésalo aquí. Solo puedes usar un código por cuenta.
            </p>
          </div>

          {hasReferrer ? (
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Ya vinculaste tu cuenta con un código de invitación.
            </p>
          ) : (
            <div className="space-y-3">
              <label className="block">
                <span className="text-on-surface-muted mb-2 block text-xs font-semibold tracking-wide uppercase">
                  Código de tu amigo
                </span>
                <input
                  type="text"
                  value={friendCode}
                  onChange={(event) => {
                    setFriendCode(event.target.value.toUpperCase());
                    setApplyFeedback(null);
                  }}
                  placeholder="Ej. P2DWWX5Y"
                  autoComplete="off"
                  spellCheck={false}
                  className={cn(
                    'border-surface-border bg-surface/50 text-on-surface w-full rounded-xl border px-4 py-3',
                    'font-mono text-sm font-semibold tracking-widest uppercase',
                    'placeholder:font-sans placeholder:normal-case placeholder:tracking-normal',
                    'focus-visible:ring-app-accent focus:border-app-accent focus-visible:ring-2 focus-visible:outline-none'
                  )}
                />
              </label>

              {applyFeedback === 'invalid' ? (
                <p className="text-sm text-red-500">Código no válido. Revisa que sea el de tu amigo, no el tuyo.</p>
              ) : null}

              {applyFeedback === 'success' ? (
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Código aplicado correctamente.
                </p>
              ) : null}

              <button
                type="button"
                disabled={applyLoading || friendCode.trim().length < 4}
                onClick={() => void handleApplyFriendCode()}
                className={cn(
                  'border-surface-border bg-surface-elevated text-on-surface inline-flex w-full cursor-pointer',
                  'items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-colors',
                  'hover:bg-surface-overlay disabled:cursor-not-allowed disabled:opacity-50',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
                )}
              >
                {applyLoading ? 'Aplicando…' : 'Aplicar código'}
              </button>
            </div>
          )}
        </div>
      </div>
    </SettingsSection>
  );
}
