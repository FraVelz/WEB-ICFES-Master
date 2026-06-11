'use client';

import { Icon, type IconSize } from '@/shared/components/Icon';
import { ICON_GALLERY_ENTRIES } from '@/shared/components/Icon/iconGalleryData';
import { cn } from '@/utils/cn';

const SIZES: IconSize[] = ['sm', 'md', 'lg'];

export function IconGallery() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-on-surface text-2xl font-bold">Icon gallery (dev)</h1>
        <p className="text-on-surface-muted mt-1 text-sm">
          {ICON_GALLERY_ENTRIES.length} icons — flex container reproduces sidebar/stats sizing.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ICON_GALLERY_ENTRIES.map(({ name, source }) => (
          <li
            key={name}
            className="border-surface-border bg-surface-elevated/80 flex flex-col gap-3 rounded-xl border p-4"
          >
            <div className="min-w-0">
              <p className="text-on-surface truncate font-mono text-sm font-semibold">{name}</p>
              <p className="text-on-surface-muted truncate text-xs">{source}</p>
            </div>

            <div className="flex h-10 items-center justify-between gap-2 rounded-lg bg-surface-elevated/60 px-3">
              {SIZES.map((size) => (
                <Icon key={size} name={name} size={size} className="text-app-accent" />
              ))}
            </div>

            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-lg',
                'bg-linear-to-br from-blue-600 to-indigo-700'
              )}
            >
              <Icon name={name} size="lg" className="text-white" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
