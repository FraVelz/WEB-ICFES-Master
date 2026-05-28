'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type ReportUserDialogProps = {
  isOpen: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ReportUserDialog({ isOpen, userName, onConfirm, onCancel }: ReportUserDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-user-title"
        aria-describedby="report-user-desc"
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3 text-red-400">
          <Icon name="flag" size="lg" />
          <h2 id="report-user-title" className="text-lg font-bold text-white">
            Reportar usuario
          </h2>
        </div>
        <p id="report-user-desc" className="mb-6 text-sm leading-relaxed text-slate-300">
          ¿Deseas reportar al usuario <strong className="text-white">{userName}</strong>? Nuestro equipo revisará el
          perfil.
        </p>
        <div className="flex gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className={cn(
              'flex-1 cursor-pointer rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200',
              'transition-colors hover:bg-slate-700',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
            )}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              'flex-1 cursor-pointer rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white',
              'transition-colors hover:bg-red-500',
              'focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none'
            )}
          >
            Reportar
          </button>
        </div>
      </div>
    </div>
  );
}
