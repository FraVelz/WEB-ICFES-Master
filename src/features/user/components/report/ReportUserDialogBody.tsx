'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import {
  PROFILE_REPORT_DETAILS_MAX,
  PROFILE_REPORT_DETAILS_MIN,
  PROFILE_REPORT_REASONS,
  type ProfileReportReason,
} from '@/features/user/constants/profileReportReasons';

type ReportUserDialogBodyProps = {
  success: boolean;
  isAuthenticated: boolean;
  reason: ProfileReportReason;
  details: string;
  submitting: boolean;
  error: string | null;
  cancelRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onLogin: () => void;
  onReasonChange: (reason: ProfileReportReason) => void;
  onDetailsChange: (details: string) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export function ReportUserDialogBody({
  success,
  isAuthenticated,
  reason,
  details,
  submitting,
  error,
  cancelRef,
  onClose,
  onLogin,
  onReasonChange,
  onDetailsChange,
  onSubmit,
}: ReportUserDialogBodyProps) {
  if (success) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-6 text-center">
        <Icon name="check-circle" className="mx-auto mb-3 text-3xl text-emerald-600 dark:text-emerald-400" />
        <p className="text-on-surface font-semibold">Reporte enviado</p>
        <p className="text-on-surface-muted mt-1 text-sm">
          Lo revisaremos pronto. Gracias por ayudarnos a mantener la comunidad segura.
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
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
              'border-surface-border bg-surface-via text-on-surface flex-1 cursor-pointer rounded-xl border',
              'hover:bg-surface-elevated px-4 py-2.5 text-sm font-semibold transition-colors',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
            )}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onLogin}
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
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
          onChange={(e) => onReasonChange(e.target.value as ProfileReportReason)}
          disabled={submitting}
          className={cn(
            'border-surface-border bg-surface-via text-on-surface w-full rounded-xl border px-3 py-2.5 text-sm',
            'focus-visible:ring-app-accent outline-none focus-visible:ring-2',
            'dark:border-surface-border dark:bg-surface-via'
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
        <label htmlFor="report-details" className="text-on-surface-muted mb-1.5 block text-xs font-bold uppercase">
          Detalles
        </label>
        <textarea
          id="report-details"
          value={details}
          onChange={(e) => onDetailsChange(e.target.value)}
          disabled={submitting}
          required
          minLength={PROFILE_REPORT_DETAILS_MIN}
          maxLength={PROFILE_REPORT_DETAILS_MAX}
          rows={5}
          placeholder="Describe qué viste en el perfil y por qué consideras que debe revisarse..."
          className={cn(
            'border-surface-border bg-surface-via text-on-surface w-full resize-none rounded-xl border',
            'focus-visible:ring-app-accent px-3 py-3 text-sm outline-none focus-visible:ring-2',
            'dark:border-surface-border dark:bg-surface-via'
          )}
        />
        <p className="text-on-surface-muted mt-1 text-xs">
          Mínimo {PROFILE_REPORT_DETAILS_MIN} caracteres · {details.trim().length}/{PROFILE_REPORT_DETAILS_MAX}
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className={cn(
            'rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm',
            'text-red-700 dark:text-red-300'
          )}
        >
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
            'hover:bg-surface-elevated text-sm font-semibold transition-colors',
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
  );
}
