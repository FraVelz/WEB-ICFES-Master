'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AsideCard } from './AsideCard';
import { DonationsModal } from './DonationsModal';

export function LearningAsideDonations() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <AsideCard title="Donaciones" icon="heart" className="min-w-0">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={cn(
            'flex w-full min-w-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold',
            'from-app-accent-strong bg-linear-to-r to-blue-600 text-white transition-opacity hover:opacity-90',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          <Icon name="heart" size="sm" className="shrink-0" />
          <span className="truncate">Apoyar el proyecto</span>
        </button>
      </AsideCard>

      <DonationsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
