'use client';

import Link from 'next/link';

import type { LessonStepRow } from '@/features/learning/types/lessonFlow';

import { LessonRenderer } from './LessonRenderer';

import 'katex/dist/katex.min.css';

type LessonFlowClientProps = {
  lessonId: string;
  lessonTitle: string;
  steps: LessonStepRow[];
};

export function LessonFlowClient({ lessonId, lessonTitle, steps }: LessonFlowClientProps) {
  return (
    <div className="min-h-[85vh] w-full">
      <header className="mx-auto mb-6 max-w-2xl border-b border-slate-700/60 px-4 pt-2 pb-6">
        <Link
          href="/ruta-aprendizaje"
          className="mb-3 inline-block text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
        >
          ← Volver a la ruta
        </Link>
        <h1 className="text-center text-2xl font-bold tracking-tight text-white md:text-3xl">{lessonTitle}</h1>
      </header>
      <LessonRenderer lessonId={lessonId} steps={steps} />
    </div>
  );
}
