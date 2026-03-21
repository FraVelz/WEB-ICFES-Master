'use client';

import { useProgress } from '../hooks/useProgress';

export const ProgressPage = () => {
  const { progress, loading, error } = useProgress();

  if (loading) return <div className="p-8 text-center text-slate-400">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

  return (
    <div className="min-h-dvh bg-slate-950 p-8 text-white">
      <h1 className="mb-6 text-2xl font-bold">Mi Progreso</h1>
      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6">
        <p className="text-slate-300">Intentos totales: {progress?.totalAttempts ?? 0}</p>
        <p className="text-slate-300">Preguntas correctas: {progress?.totalCorrect ?? 0}</p>
        <p className="text-slate-300">Porcentaje: {progress?.percentage ?? 0}%</p>
      </div>
    </div>
  );
};
