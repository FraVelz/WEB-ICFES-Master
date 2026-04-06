'use client';

import { cn } from '@/utils/cn';
import { useEffect } from 'react';

import type { ResourceStepData } from '@/features/learning/types/lessonFlow';

type ResourceStepProps = {
  data: ResourceStepData;
  onStepReady: () => void;
};

export function ResourceStep({ data, onStepReady }: ResourceStepProps) {
  useEffect(() => {
    onStepReady();
  }, [onStepReady]);

  const isPdf = data.format === 'pdf';
  const isVideo = data.format === 'video';
  const isLink = data.format === 'link';

  return (
    <div className="space-y-4">
      <h3 className="text-center text-xl font-semibold text-white md:text-2xl">{data.title}</h3>
      {isPdf ? (
        <div className="overflow-hidden rounded-xl border border-slate-600 bg-black/40 shadow-inner">
          <iframe title={data.title} src={data.url} className="h-[min(70vh,560px)] w-full" />
        </div>
      ) : null}
      {isVideo ? (
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-600 bg-black">
          <iframe
            title={data.title}
            src={data.url}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}
      {isLink ? (
        <div className="flex justify-center">
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex min-h-[52px] items-center justify-center rounded-xl bg-cyan-600 px-8 text-lg',
              'font-semibold text-white transition hover:bg-cyan-500'
            )}
          >
            Abrir recurso
          </a>
        </div>
      ) : null}
    </div>
  );
}
