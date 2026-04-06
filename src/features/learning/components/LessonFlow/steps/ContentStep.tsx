'use client';

import { cn } from '@/utils/cn';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import type { ContentStepData } from '@/features/learning/types/lessonFlow';

import { MathBlock } from '../MathBlock';

type ContentStepProps = {
  data: ContentStepData;
  onStepReady: () => void;
};

export function ContentStep({ data, onStepReady }: ContentStepProps) {
  useEffect(() => {
    onStepReady();
  }, [onStepReady]);

  return (
    <article className="space-y-6">
      <h2 className="text-center text-2xl font-bold tracking-tight text-white md:text-3xl">{data.title}</h2>
      <div
        className={cn(
          'max-w-none text-lg leading-relaxed text-slate-200 [&_p]:mb-4 [&_p:last-child]:mb-0',
          '[&_strong]:font-semibold [&_strong]:text-white'
        )}
      >
        <ReactMarkdown>{data.text}</ReactMarkdown>
      </div>
      {data.math ? <MathBlock latex={data.math} display /> : null}
    </article>
  );
}
