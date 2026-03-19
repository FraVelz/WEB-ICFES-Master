'use client';

import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { getAnimationStyle } from "@/features/home/hooks/animations";

export const HeroSection = ({ isInitialLoad, onDemoAccess }) => {
  const handleDemoClick = () => {
    if (onDemoAccess) {
      onDemoAccess();
    } else {
      if (typeof window !== 'undefined') {
        localStorage.setItem('demoMode', 'true');
        window.location.href = '/ruta-aprendizaje';
      }
    }
  };

  return (
    <section className="min-h-dvh flex items-center justify-center pt-5 sm:pt-20 px-6 md:px-8">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div style={getAnimationStyle(true, isInitialLoad, 0)} className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full px-4 py-2">
          <Icon name="star" className="text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-400">Conviertete en en uno de los primeros estudiantes en alcanzar +400</span>
        </div>

        {/* Main Title */}
        <h1 style={getAnimationStyle(true, isInitialLoad, 0.15)} className="text-5xl md:text-7xl lg:text-8xl font-black bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
          Domina el ICFES desde Cero
        </h1>

        {/* Subtitle */}
        <p style={getAnimationStyle(true, isInitialLoad, 0.3)} className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          La plataforma #1 con <span className="font-bold text-cyan-400">+500 preguntas</span>, simulacros reales, gamificación adictiva y eficiente, y una comunidad de estudiantes preparándose contigo.
        </p>

        {/* CTA Buttons */}
        <div style={getAnimationStyle(true, isInitialLoad, 0.45)} className="flex flex-col md:flex-row gap-4 justify-center pt-4">
          <button
            onClick={handleDemoClick}
            className="cursor-pointer px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-lg"
          >
            <Icon name="play" />
            Probar Demo
          </button>
          <Link
            href="/login"
            className="px-8 py-4 border-2 border-cyan-500 text-white font-bold rounded-lg hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 flex items-center justify-center gap-2 text-lg hover:shadow-lg hover:shadow-cyan-500/30"
          >
            <Icon name="rocket" />
            Iniciar Sesión
          </Link>
        </div>

        {/* Stats */}
        <div style={getAnimationStyle(true, isInitialLoad, 0.6)} className="grid grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto">
          <div className="bg-slate-800/50 p-2 sm:p-4 rounded-lg border border-slate-700">
            <p className="text-3xl font-bold text-cyan-400">+500</p>
            <p className="text-xs text-slate-400 mt-1">Preguntas</p>
          </div>
          <div className="bg-slate-800/50 p-2 sm:p-4 rounded-lg border border-slate-700">
            <p className="text-3xl font-bold text-purple-400">+1</p>
            <p className="text-xs text-slate-400 mt-1">Estudiantes</p>
          </div>
          <div className="bg-slate-800/50 p-2 sm:p-4 rounded-lg border border-slate-700">
            <p className="text-3xl font-bold text-pink-400">?400</p>
            <p className="text-xs text-slate-400 mt-1">Puntaje promedio</p>
          </div>
        </div>
      </div>
    </section>
  );
};
