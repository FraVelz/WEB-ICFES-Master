'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/shared/components/Icon';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import { cn } from '@/utils/cn';

type PdfViewerModalProps = {
  isOpen: boolean;
  title: string;
  url: string;
  onClose: () => void;
};

const actionButtonClass =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors text-on-surface-muted hover:bg-app-ring/20 hover:text-on-surface active:bg-app-ring/30 focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:ring-offset-surface-elevated';

const iconButtonClass =
  'inline-flex cursor-pointer items-center justify-center rounded-lg p-2 transition-colors text-on-surface-muted hover:bg-app-ring/20 hover:text-on-surface active:bg-app-ring/30 focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:ring-offset-surface-elevated';

export function PdfViewerModal({ isOpen, title, url, onClose }: PdfViewerModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useDialogA11y(isOpen, onClose, dialogRef);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const modal = (
    <div
      className={cn(
        'fixed inset-0 z-70 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm',
        'sm:items-center sm:p-4'
      )}
    >
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-viewer-title"
        className={cn(
          'border-surface-border bg-surface-elevated relative z-10 flex h-[92dvh] w-full flex-col',
          'rounded-t-2xl border shadow-2xl sm:h-[85dvh] sm:max-w-5xl sm:rounded-2xl'
        )}
      >
        <header className="border-surface-border flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
          <h2 id="pdf-viewer-title" className="text-on-surface line-clamp-2 text-base font-semibold sm:text-lg">
            {title}
          </h2>

          <div className="flex shrink-0 items-center gap-1">
            <a href={url} target="_blank" rel="noopener noreferrer" className={actionButtonClass}>
              <Icon name="arrow-right-from-bracket" size="sm" aria-hidden="true" />
              <span className="hidden sm:inline">Abrir</span>
            </a>
            <a href={url} download className={actionButtonClass}>
              <Icon name="arrow-down" size="sm" aria-hidden="true" />
              <span className="hidden sm:inline">Descargar</span>
            </a>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className={iconButtonClass}
              aria-label="Cerrar visor de PDF"
            >
              <Icon name="times" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="bg-surface-elevated/40 min-h-0 flex-1">
          <iframe
            src={url}
            title={title}
            sandbox="allow-downloads allow-scripts allow-same-origin"
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
}
