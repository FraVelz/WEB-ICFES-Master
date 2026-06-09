'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import { getInfographicPdfUrl, isInfographicStorageConfigured } from '@/shared/utils/infographicAssetUrl';
import {
  ICFES_INFOGRAPHIC_GROUPS,
  ICFES_INFOGRAPHICS_INTRO,
  type IcfesInfographic,
} from '../data/icfesInfographics';
import { PdfViewerModal } from './PdfViewerModal';

type ActivePdf = {
  title: string;
  url: string;
};

export function IcfesInfographicsSection() {
  const [activePdf, setActivePdf] = useState<ActivePdf | null>(null);
  const storageConfigured = isInfographicStorageConfigured();

  const itemsWithUrl = useMemo(
    () =>
      ICFES_INFOGRAPHIC_GROUPS.flatMap((group) =>
        group.items.map((item) => ({
          group,
          item,
          url: getInfographicPdfUrl(item),
        })),
      ),
    [],
  );

  const openPdf = (item: IcfesInfographic) => {
    setActivePdf({ title: item.title, url: getInfographicPdfUrl(item) });
  };

  return (
    <>
      <section aria-labelledby="tips-icfes-infographics" className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="bg-app-ring/15 text-app-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <Icon name="clipboard-list" />
          </div>
          <div>
            <h2 id="tips-icfes-infographics" className="text-on-surface text-xl font-bold">
              Infografías oficiales Saber 11°
            </h2>
            <p className="text-on-surface-muted mt-1 text-sm leading-relaxed">{ICFES_INFOGRAPHICS_INTRO}</p>
          </div>
        </div>

        {!storageConfigured && (
          <div
            className="border-amber-500/30 bg-amber-500/10 text-on-surface rounded-2xl border px-4 py-3 text-sm leading-relaxed"
            role="status"
          >
            Configura R2 en <code className="text-amber-200">.env.local</code>: credenciales del servidor (
            <code className="text-amber-200">R2_*</code>) +{' '}
            <code className="text-amber-200">NEXT_PUBLIC_R2_USE_API=true</code>, o una URL pública{' '}
            <code className="text-amber-200">NEXT_PUBLIC_R2_PUBLIC_URL</code>.
          </div>
        )}

        <div className="space-y-8">
          {ICFES_INFOGRAPHIC_GROUPS.map((group) => (
            <div key={group.id} className="space-y-3">
              <h3 className="text-on-surface text-sm font-semibold tracking-wide uppercase">{group.area}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((item) => {
                  const disabled = !storageConfigured;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => openPdf(item)}
                      className={cn(
                        'border-surface-border bg-surface-elevated/90 rounded-2xl border p-4 text-left shadow-sm',
                        'transition-all duration-200',
                        'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                        'focus-visible:ring-offset-slate-950',
                        'enabled:cursor-pointer enabled:hover:border-app-ring/50 enabled:hover:bg-surface-elevated',
                        'enabled:hover:shadow-app-ring/10 enabled:hover:-translate-y-0.5 enabled:hover:shadow-md',
                        'enabled:active:translate-y-0 enabled:active:shadow-sm',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                    >
                      <div className="mb-2 flex items-start gap-2">
                        <Icon name="book-open" className="text-app-accent mt-0.5 shrink-0" size="sm" />
                        <span className="text-on-surface font-semibold">{item.title}</span>
                      </div>
                      <p className="text-on-surface-muted text-sm leading-relaxed">{item.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {storageConfigured && (
          <p className="text-on-surface-muted text-xs">
            {itemsWithUrl.length} documentos disponibles desde Cloudflare R2.
          </p>
        )}
      </section>

      {activePdf && (
        <PdfViewerModal
          isOpen
          title={activePdf.title}
          url={activePdf.url}
          onClose={() => setActivePdf(null)}
        />
      )}
    </>
  );
}
