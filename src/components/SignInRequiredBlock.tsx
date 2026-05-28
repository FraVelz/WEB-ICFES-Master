'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

import { exitDemoModeToHome } from '@/store/demoMode';

interface SignInRequiredBlockProps {
  title?: string;
  message?: string;
}

export default function SignInRequiredBlock({
  title = 'Crea una cuenta para continuar',
  message = 'Esta sección solo está disponible para usuarios registrados. Inicia sesión o crea una cuenta gratuita para acceder.',
}: SignInRequiredBlockProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleCloseDemo = () => {
    setIsLeaving(true);
    exitDemoModeToHome();
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-linear-to-b from-black via-slate-950 to-black p-6">
      {isLeaving && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="border-app-ring/30 border-t-app-ring h-12 w-12 animate-spin rounded-full border-4" />
        </div>
      )}
      <div
        className={cn(
          'w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/50 p-8 text-center transition-opacity',
          isLeaving && 'pointer-events-none opacity-40'
        )}
      >
        <div className="border-app-ring/50 bg-app-ring/20 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2">
          <Icon name="lock" size="xl" className="text-app-accent" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-white">{title}</h2>
        <p className="mb-8 text-slate-400">{message}</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className={cn(
              'from-cta-from flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r',
              'to-cta-to px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg',
              'hover:shadow-app-ring/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
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
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'focus-visible:ring-offset-slate-900',
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
              'border-slate-600 bg-transparent px-6 py-3 font-semibold text-slate-400 transition-all',
              'duration-300 hover:border-slate-500 hover:text-white disabled:cursor-wait disabled:opacity-60',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'focus-visible:ring-offset-slate-950'
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
