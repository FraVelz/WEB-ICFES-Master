'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import {
  PROFILE_REPORT_DETAILS_MAX,
  PROFILE_REPORT_DETAILS_MIN,
  PROFILE_REPORT_REASONS,
  type ProfileReportReason,
} from '@/features/user/constants/profileReportReasons';
import { submitProfileReport } from '@/services/profile/profileReportService';

type ReportUserDialogProps = {
  isOpen: boolean;
  reportedUserId: string;
  reportedUserName: string;
  profileUrl: string;
  isAuthenticated: boolean;
  reporterEmail?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export function ReportUserDialog({
  isOpen,
  reportedUserId,
  reportedUserName,
  profileUrl,
  isAuthenticated,
  reporterEmail,
  onClose,
  onSuccess,
}: ReportUserDialogProps) {
  const router = useRouter();
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [reason, setReason] = useState<ProfileReportReason>('inappropriate_content');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setReason('inappropriate_content');
      setDetails('');
      setSubmitting(false);
      setError(null);
      setSuccess(false);
      return;
    }

    cancelRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, submitting]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    const resolvedProfileUrl =
      profileUrl.trim() ||
      (typeof window !== 'undefined'
        ? window.location.href
        : `/perfil/public?userId=${encodeURIComponent(reportedUserId)}`);

    const result = await submitProfileReport({
      reportedUserId,
      reportedUserName,
      profileUrl: resolvedProfileUrl,
      reason,
      details,
      reporterEmail,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    onSuccess?.();
    window.setTimeout(() => onClose(), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!submitting) onClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={cn(
          'border-surface-border bg-surface-elevated w-full max-w-lg rounded-2xl border p-6 shadow-2xl',
          'dark:border-slate-700 dark:bg-slate-900'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
              <Icon name="flag" />
            </div>
            <div>
              <h2 id={titleId} className="text-on-surface text-lg font-bold">
                Reportar perfil
              </h2>
              <p id={descId} className="text-on-surface-muted mt-0.5 text-sm">
                Usuario: <strong className="text-on-surface">{reportedUserName}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={cn(
              'text-on-surface-muted hover:text-on-surface cursor-pointer rounded-lg p-1 transition-colors',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            aria-label="Cerrar"
          >
            <Icon name="x-mark" />
          </button>
        </div>

        {success ? (
          <div className="border-emerald-500/30 bg-emerald-500/10 rounded-xl border px-4 py-6 text-center">
            <Icon name="check-circle" className="mx-auto mb-3 text-3xl text-emerald-600 dark:text-emerald-400" />
            <p className="text-on-surface font-semibold">Reporte enviado</p>
            <p className="text-on-surface-muted mt-1 text-sm">
              Lo revisaremos pronto. Gracias por ayudarnos a mantener la comunidad segura.
            </p>
          </div>
        ) : !isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-on-surface-muted text-sm leading-relaxed">
              Para enviar un reporte necesitas iniciar sesión. Así evitamos spam y podemos contactarte si hace falta.
            </p>
            <div className="flex gap-3">
              <button
                ref={cancelRef}
                type="button"
                onClick={onClose}
                className={cn(
                  'border-surface-border bg-surface-via text-on-surface flex-1 cursor-pointer rounded-xl border px-4 py-2.5',
                  'text-sm font-semibold transition-colors hover:bg-surface-elevated',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
                )}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className={cn(
                  'from-app-accent-strong flex-1 cursor-pointer rounded-xl bg-linear-to-r to-blue-600 px-4 py-2.5',
                  'text-sm font-semibold text-white transition-opacity hover:opacity-90',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
                )}
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-on-surface-muted text-sm leading-relaxed">
              Cuéntanos qué ocurre. El reporte quedará registrado para revisión del equipo.
            </p>

            <div>
              <label htmlFor="report-reason" className="text-on-surface-muted mb-1.5 block text-xs font-bold uppercase">
                Motivo
              </label>
              <select
                id="report-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value as ProfileReportReason)}
                disabled={submitting}
                className={cn(
                  'border-surface-border bg-surface-via text-on-surface w-full rounded-xl border px-3 py-2.5 text-sm',
                  'focus-visible:ring-app-accent outline-none focus-visible:ring-2',
                  'dark:border-slate-700 dark:bg-slate-950'
                )}
              >
                {PROFILE_REPORT_REASONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="report-details"
                className="text-on-surface-muted mb-1.5 block text-xs font-bold uppercase"
              >
                Detalles
              </label>
              <textarea
                id="report-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                disabled={submitting}
                required
                minLength={PROFILE_REPORT_DETAILS_MIN}
                maxLength={PROFILE_REPORT_DETAILS_MAX}
                rows={5}
                placeholder="Describe qué viste en el perfil y por qué consideras que debe revisarse..."
                className={cn(
                  'border-surface-border bg-surface-via text-on-surface w-full resize-none rounded-xl border px-3 py-3 text-sm',
                  'focus-visible:ring-app-accent outline-none focus-visible:ring-2',
                  'dark:border-slate-700 dark:bg-slate-950'
                )}
              />
              <p className="text-on-surface-muted mt-1 text-xs">
                Mínimo {PROFILE_REPORT_DETAILS_MIN} caracteres · {details.trim().length}/{PROFILE_REPORT_DETAILS_MAX}
              </p>
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                ref={cancelRef}
                type="button"
                onClick={onClose}
                disabled={submitting}
                className={cn(
                  'border-surface-border bg-surface-via text-on-surface flex-1 cursor-pointer rounded-xl border px-4 py-2.5',
                  'text-sm font-semibold transition-colors hover:bg-surface-elevated',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || details.trim().length < PROFILE_REPORT_DETAILS_MIN}
                className={cn(
                  'flex-1 cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white',
                  'transition-colors hover:bg-red-500',
                  'focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                {submitting ? 'Enviando...' : 'Enviar reporte'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
