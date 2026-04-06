'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';

interface SignInRequiredBlockProps {
  title?: string;
  message?: string;
}

export default function SignInRequiredBlock({
  title = 'Inicia sesión para continuar',
  message = 'Esta sección requiere que inicies sesión con tu cuenta para poder utilizarla.',
}: SignInRequiredBlockProps) {
  const handleCloseDemo = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demoMode');
      window.location.href = '/';
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-linear-to-b from-black via-slate-950 to-black p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/50 p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-500/50 bg-cyan-500/20">
          <Icon name="lock" size="xl" className="text-cyan-400" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-white">{title}</h2>
        <p className="mb-8 text-slate-400">{message}</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-cyan-500',
              'to-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg',
              'hover:shadow-cyan-500/30'
            )}
          >
            <Icon name="sign-in-alt" />
            Iniciar Sesión
          </Link>
          <button
            onClick={handleCloseDemo}
            className={cn(
              'flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2',
              'border-slate-600 bg-transparent px-6 py-3 font-semibold text-slate-400 transition-all',
              'duration-300 hover:border-slate-500 hover:text-white'
            )}
          >
            <Icon name="times" />
            Cerrar Demo
          </button>
        </div>
      </div>
    </div>
  );
}
