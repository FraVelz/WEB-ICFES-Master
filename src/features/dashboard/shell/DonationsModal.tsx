'use client';

import Link from 'next/link';
import { useId, useRef } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import { DonationMethods } from '@/features/user/components/settings/DonationMethods';
import { DONATION_INTRO } from '@/features/user/components/settings/donationConstants';

type DonationsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function DonationsModal({ isOpen, onClose }: DonationsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useDialogA11y(isOpen, onClose, dialogRef);

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar diálogo"
        className="fixed inset-0 z-80 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="pointer-events-none fixed inset-0 z-90 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className={cn(
            'border-surface-border bg-surface-elevated pointer-events-auto w-full max-w-2xl',
            'animate-zoom-in rounded-2xl border p-6 shadow-2xl motion-reduce:animate-none'
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-app-ring/15 text-app-accent flex h-10 w-10 items-center justify-center rounded-full">
                <Icon name="heart" />
              </div>
              <div>
                <h2 id={titleId} className="text-on-surface text-xl font-bold">
                  Apoya el proyecto
                </h2>
                <p id={descId} className="text-on-surface-muted mt-1 text-sm leading-relaxed">
                  {DONATION_INTRO}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className={cn(
                'text-on-surface-muted hover:text-on-surface flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg',
                'hover:bg-surface-via transition-colors',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
              )}
            >
              <Icon name="times" />
            </button>
          </div>

          <DonationMethods />

          <Link
            href="/configuracion"
            onClick={onClose}
            className="text-on-surface-muted hover:text-app-accent mt-5 inline-flex items-center gap-1 text-xs transition-colors"
          >
            Más opciones en configuración
            <Icon name="chevron-right" size="sm" />
          </Link>
        </div>
      </div>
    </>
  );
}
