'use client';

import { useId, useRef } from 'react';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ReportUserDialogBody } from './report/ReportUserDialogBody';
import { useReportUserDialog } from './report/useReportUserDialog';

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useDialogA11y(isOpen, onClose, dialogRef);

  const { cancelRef, reason, setReason, details, setDetails, submitting, error, success, handleSubmit } =
    useReportUserDialog({
      isOpen,
      reportedUserId,
      reportedUserName,
      profileUrl,
      isAuthenticated,
      reporterEmail,
      onClose,
      onSuccess,
    });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={() => {
        if (!submitting) onClose();
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
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

        <ReportUserDialogBody
          success={success}
          isAuthenticated={isAuthenticated}
          reason={reason}
          details={details}
          submitting={submitting}
          error={error}
          cancelRef={cancelRef}
          onClose={onClose}
          onLogin={() => router.push('/login')}
          onReasonChange={setReason}
          onDetailsChange={setDetails}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
