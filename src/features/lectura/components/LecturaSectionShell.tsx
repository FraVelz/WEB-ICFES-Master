'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import type { LecturaSectionId } from '../constants';
import { useLecturaRead } from '../hooks/useLecturaRead';

type LecturaSectionShellProps = {
  sectionId: LecturaSectionId;
  children: ReactNode;
};

const navButtonClass = cn(
  'text-on-surface-muted hover:text-on-surface inline-flex items-center gap-2 text-sm font-semibold transition-colors',
  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
  'focus-visible:ring-offset-surface'
);

export function LecturaSectionShell({ sectionId, children }: LecturaSectionShellProps) {
  const router = useRouter();
  const { isRead, markAsRead, unmarkAsRead } = useLecturaRead();
  const read = isRead(sectionId);

  const handleActionAndReturn = () => {
    if (read) {
      unmarkAsRead(sectionId);
    } else {
      markAsRead(sectionId);
    }
    router.push('/lectura');
  };

  return (
    <div className="space-y-10">
      <Link href="/lectura" className={navButtonClass}>
        <Icon name="arrow-left" className="text-base" />
        Regresar
      </Link>

      {children}

      <div className="border-surface-border flex flex-col items-center gap-3 border-t pt-8">
        <button
          type="button"
          onClick={handleActionAndReturn}
          className={cn(
            'inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface',
            read
              ? 'border-surface-border bg-surface-elevated text-on-surface-muted hover:text-on-surface hover:bg-surface-elevated/80 border'
              : 'bg-app-accent shadow-app-accent/20 text-white shadow-lg hover:brightness-110'
          )}
        >
          <Icon name={read ? 'times' : 'book-open'} className="text-base" />
          {read ? 'Desmarcar como leído y regresar' : 'Marcar como leído y regresar'}
        </button>
      </div>
    </div>
  );
}
