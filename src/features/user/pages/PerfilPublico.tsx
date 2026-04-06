'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { useUserProfile } from '../hooks/useUserProfile';

export const PerfilPublico = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const router = useRouter();
  const {
    photoUrl,
    name,
    personalPhrase,
    createdAt,
    level,
    totalXP,
    levelInfo,
    achievements,
    coursesProgress,
    loading,
    exists,
  } = useUserProfile(userId || undefined);

  const [copied, setCopied] = useState(false);

  if (!userId) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950 text-white">
        <div className="max-w-md space-y-6 px-4 text-center">
          <div className="text-6xl text-slate-700">
            <Icon name="user-slash" />
          </div>
          <h2 className="text-2xl font-bold">Enlace inválido</h2>
          <p className="text-slate-400">Debes proporcionar un ID de usuario en la URL.</p>
          <button
            onClick={() => router.push('/')}
            className="cursor-pointer rounded-lg bg-cyan-600 px-6 py-2 font-medium transition-colors hover:bg-cyan-500"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }
  const [reported, setReported] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReport = () => {
    // Aquí iría la lógica real de reporte (ej: abrir modal o enviar a backend)
    if (window.confirm(`¿Deseas reportar al usuario ${name}?`)) {
      setReported(true);
      // Simulación de reporte enviado
      setTimeout(() => setReported(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950">
        <div className="space-y-4 text-center">
          <div className="animate-spin text-4xl text-cyan-400">
            <Icon name="spinner" />
          </div>
          <p className="text-lg text-slate-300">Cargando perfil público...</p>
        </div>
      </div>
    );
  }

  if (!exists) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950 text-white">
        <div className="max-w-md space-y-6 px-4 text-center">
          <div className="text-6xl text-slate-700">
            <Icon name="user-slash" />
          </div>
          <h2 className="text-2xl font-bold">Usuario no encontrado</h2>
          <p className="text-slate-400">El perfil que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => router.push('/')}
            className="cursor-pointer rounded-lg bg-cyan-600 px-6 py-2 font-medium transition-colors hover:bg-cyan-500"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-950 pb-24 text-white md:pb-0">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-96 w-full bg-linear-to-b from-purple-900/20 to-transparent"></div>
        <div className="absolute top-1/4 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4 py-8">
        {/* Header Profile Card */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="absolute top-0 right-0 flex gap-2 p-4">
            <button
              onClick={handleShare}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-800 p-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-slate-700"
              title="Copiar enlace"
            >
              <Icon name={copied ? 'check' : 'share-nodes'} />
              <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Compartir'}</span>
            </button>
            <button
              onClick={handleReport}
              className={`cursor-pointer rounded-lg bg-slate-800 p-2 transition-colors hover:bg-red-900/30 ${reported ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
              title="Reportar usuario"
            >
              <Icon name="flag" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-8 md:flex-row">
            {/* Avatar */}
            <div className="group relative">
              <div className="h-32 w-32 rounded-full border-4 border-purple-500/30 bg-slate-950 p-1 shadow-lg shadow-purple-500/20 md:h-40 md:w-40">
                <img
                  src={photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                  alt={name}
                  className="h-full w-full rounded-full bg-slate-800 object-cover"
                />
              </div>
              <div className="absolute -right-2 -bottom-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold text-purple-400 shadow-lg">
                {levelInfo?.levelIcon} Nivel {levelInfo?.level || level}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white md:text-4xl">{name}</h1>
              <p className="text-lg text-slate-400 italic">"{personalPhrase}"</p>

              <div className="flex items-center justify-center gap-4 pt-2 text-sm text-slate-500 md:justify-start">
                <span className="flex items-center gap-2">
                  <Icon name="calendar-alt" />
                  Miembro desde: {createdAt}
                </span>
              </div>

              {/* XP Bar */}
              <div className="mt-4 max-w-md">
                <div className="mb-2 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-purple-400" title={`XP Total: ${totalXP || 0}`}>
                      {typeof totalXP === 'number' ? totalXP : 0}
                    </span>
                    <span className="text-slate-400">XP Total</span>
                    {false && <span className="ml-2 text-xs text-red-400">⚠️ Diferencia detectada</span>}
                  </div>
                  {levelInfo?.xpForNextLevel !== null && levelInfo?.xpForNextLevel > 0 ? (
                    <span className="text-slate-500">
                      {levelInfo?.xpForNextLevel} XP para Nivel {(levelInfo?.level || level) + 1}
                    </span>
                  ) : (
                    <span className="font-semibold text-yellow-400">Nivel Máximo</span>
                  )}
                </div>
                <div className="h-4 overflow-hidden rounded-full border border-slate-700 bg-slate-800 shadow-inner">
                  <div
                    className={`h-full bg-linear-to-r ${levelInfo?.levelColor || 'from-purple-500 to-purple-600'} shadow-lg transition-all duration-1000`}
                    style={{ width: `${levelInfo?.xpProgress || 0}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-300">Nivel {levelInfo?.level || level}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{levelInfo?.levelName || 'Aprendiz'}</span>
                    {levelInfo?.levelIcon && <span className="text-lg">{levelInfo?.levelIcon}</span>}
                  </div>
                  {levelInfo?.xpProgress !== null && (
                    <span className="text-slate-500">{Math.round(levelInfo?.xpProgress || 0)}%</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Stats & Courses */}
          <div className="space-y-8 lg:col-span-2">
            {/* Recent Activity / Stats */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold">
                <Icon name="chart-line" className="text-green-400" />
                Estadísticas
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-slate-800/50 p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {achievements.filter((a) => a.status === 'completed').length}
                  </div>
                  <div className="mt-1 text-xs text-slate-400 uppercase">Logros</div>
                </div>
                <div className="rounded-xl bg-slate-800/50 p-4 text-center">
                  <div className="text-2xl font-bold text-white">{level}</div>
                  <div className="mt-1 text-xs text-slate-400 uppercase">Nivel</div>
                </div>
                <div className="rounded-xl bg-slate-800/50 p-4 text-center">
                  <div className="text-2xl font-bold text-white">{typeof totalXP === 'number' ? totalXP : 0}</div>
                  <div className="mt-1 text-xs text-slate-400 uppercase">XP Total</div>
                </div>
              </div>
            </div>

            {/* Courses Progress (Read Only) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold">
                <Icon name="book-open" className="text-purple-400" />
                Progreso en Cursos
              </h2>

              <div className="space-y-6">
                {Object.entries(coursesProgress).length > 0 ? (
                  Object.entries(coursesProgress).map(([courseId, progress]) => (
                    <div key={courseId} className="group">
                      <div className="mb-2 flex justify-between">
                        <span className="font-medium text-slate-200 capitalize">{courseId.replace('-', ' ')}</span>
                        <span className="font-bold text-purple-400">{Number(progress)}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                        <div className="h-full rounded-full bg-purple-500" style={{ width: `${Number(progress)}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-500">
                    <p>Este usuario aún no ha iniciado cursos.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Achievements */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-3 text-xl font-bold">
                  <Icon name="trophy" className="text-yellow-400" />
                  Logros
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {achievements.slice(0, 9).map((achievement) => {
                  const isUnlocked = achievement.status === 'completed';
                  return (
                    <div
                      key={achievement.id}
                      className={`flex aspect-square flex-col items-center justify-center rounded-xl border p-2 transition-all ${
                        isUnlocked
                          ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                          : 'border-slate-700 bg-slate-800/50 text-slate-600 opacity-50 grayscale'
                      }`}
                      title={achievement.title}
                    >
                      <Icon
                        name={typeof achievement.icon === 'string' ? achievement.icon : 'star'}
                        className="mb-1 text-2xl"
                      />
                      {isUnlocked && (
                        <Icon name="star" size="sm" className="absolute top-2 right-2 text-[8px] text-yellow-200" />
                      )}
                    </div>
                  );
                })}
              </div>

              {achievements.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">Sin logros desbloqueados aún.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
