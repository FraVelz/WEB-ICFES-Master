'use client';

import { MascotaCircle } from '@/shared/components/MascotaCircle';

export const HomePageMobile = () => {
  return (
    <div className="flex h-dvh w-screen flex-col bg-linear-to-b from-black via-slate-950 to-black text-white">
      {/* Background glow effects - Optimizado para móvil */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-48 w-48 animate-pulse rounded-full bg-blue-500/30 blur-2xl"></div>
        <div className="absolute right-1/4 bottom-1/3 h-48 w-48 animate-pulse rounded-full bg-purple-500/30 blur-2xl"></div>
        <div className="absolute top-2/3 left-3/4 h-32 w-32 animate-pulse rounded-full bg-indigo-500/20 blur-2xl"></div>
      </div>

      {/* Main Content - Centro */}
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 px-6">
          {/* Logo */}
          <MascotaCircle src="/avatars/logo.webp" size="md" />

          {/* App Name */}
          <h1 className="text-3xl font-bold text-white">ICFES Master</h1>

          {/* Tagline */}
          <p className="max-w-xs text-center text-sm text-gray-300">
            Domina el examen ICFES con nuestras plataforma, y diviertete
            mientras aprendes.
          </p>
        </div>
      </div>

      {/* Bottom Buttons - Pegado abajo */}
      <div className="relative z-10 flex w-full flex-col gap-3 px-6 py-6">
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('demoMode', 'true');
              window.location.href = '/ruta-aprendizaje';
            }
          }}
          className="block w-full transform rounded-lg bg-linear-to-r from-blue-500 to-blue-600 py-3 text-center font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700"
        >
          Probar Demo
        </button>

        <a
          href="/login"
          className="block w-full rounded-lg border-2 border-blue-500 bg-transparent py-3 text-center font-semibold text-blue-400 transition-all duration-200 hover:bg-blue-500/10"
        >
          Iniciar Sesión
        </a>
      </div>
    </div>
  );
};
