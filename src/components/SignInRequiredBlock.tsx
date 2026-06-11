'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

import { exitDemoModeToHome } from '@/store/demoMode';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

interface SignInRequiredBlockProps {
  title?: string;
  message?: string;
}

export default function SignInRequiredBlock({
  title = 'Crea una cuenta para continuar',
  message = 'Esta sección solo está disponible para usuarios registrados. Inicia sesión o crea una cuenta gratuita ' +
    'para acceder.',
}: SignInRequiredBlockProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleCloseDemo = () => {
    setIsLeaving(true);
    exitDemoModeToHome();
  };

  return (
    <div className={cn('relative flex items-center justify-center p-6', FULL_PAGE_SHELL_CLASS)}>
      {isLeaving && (
        <div
          className={cn(
            'bg-surface/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm',
            'dark:bg-black/60'
          )}
        >
          <div className="border-app-ring/30 border-t-app-ring h-12 w-12 animate-spin rounded-full border-4" />
        </div>
      )}
      <div
        className={cn(
          'border-surface-border bg-surface-elevated dark:bg-surface-elevated/80 w-full max-w-md',
          'rounded-2xl border p-8 text-center shadow-md transition-opacity dark:shadow-none',
          isLeaving && 'pointer-events-none opacity-40'
        )}
      >
        <div
          className={cn(
            'border-app-ring/70 bg-surface-elevated dark:border-app-ring/50 dark:bg-app-ring/20',
            'mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-sm',
            'dark:shadow-none'
          )}
        >
          <Icon name="lock" size="xl" className="text-app-accent" />
        </div>
        <h2 className="text-on-surface mb-3 text-2xl font-bold">{title}</h2>
        <p className="text-on-surface-muted mb-8">{message}</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className={cn(
              'from-cta-from flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r',
              'to-cta-to px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg',
              'hover:shadow-app-ring/30 focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface focus-visible:ring-offset-2',
              isLeaving && 'pointer-events-none opacity-50'
            )}
          >
            <Icon name="sign-in-alt" />
            Iniciar sesión
          </Link>
          <Link
            href="/signup"
            className={cn(
              'border-app-ring/40 flex w-full items-center justify-center gap-2 rounded-lg border-2',
              'bg-app-ring/10 text-app-accent px-6 py-3 font-semibold transition-all duration-300',
              'hover:border-app-ring/60 hover:bg-app-ring/20',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface focus-visible:ring-offset-2',
              isLeaving && 'pointer-events-none opacity-50'
            )}
          >
            <Icon name="circle-user" />
            Crear cuenta
          </Link>
          <button
            type="button"
            onClick={handleCloseDemo}
            disabled={isLeaving}
            className={cn(
              'flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2',
              'border-surface-border bg-surface-elevated text-on-surface-muted px-6 py-3 font-semibold transition-all',
              'hover:border-app-ring/50 hover:text-on-surface duration-300 disabled:cursor-wait disabled:opacity-60',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface focus-visible:ring-offset-2'
            )}
          >
            {isLeaving ? (
              <>
                <Icon name="spinner" className="animate-spin" />
                Saliendo...
              </>
            ) : (
              <>
                <Icon name="times" />
                Volver al inicio
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
