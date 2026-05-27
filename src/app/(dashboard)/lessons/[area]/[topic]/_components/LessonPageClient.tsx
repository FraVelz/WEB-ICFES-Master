'use client';

import { useParams } from 'next/navigation';

import { getLegacyLessonComponent } from '@/features/learning/lessons-legacy/registry';

export function LessonPageClient() {
  const params = useParams();
  const area = params.area as string;
  const topic = params.topic as string;

  const Component = getLegacyLessonComponent(area, topic);

  if (!Component) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center text-white">
        <h1 className="mb-4 text-2xl font-bold">Lección no encontrada</h1>
        <p className="text-slate-400">
          No hay contenido para <strong>{area}</strong> / <strong>{topic}</strong>.
        </p>
      </div>
    );
  }

  return <Component />;
}
