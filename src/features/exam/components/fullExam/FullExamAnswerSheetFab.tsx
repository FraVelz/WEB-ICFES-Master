'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type FullExamAnswerSheetFabProps = {
  isOpen: boolean;
  answeredCount: number;
  onOpen: () => void;
};

export function FullExamAnswerSheetFab({ isOpen, answeredCount, onOpen }: FullExamAnswerSheetFabProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <button
      type="button"
      onClick={onOpen}
      aria-label="Abrir hoja de respuestas"
      aria-expanded={isOpen}
      className={cn(
        'fixed left-4 z-[120] hidden h-14 w-14 items-center justify-center rounded-full sm:flex xl:hidden',
        'bottom-[max(1.25rem,env(safe-area-inset-bottom))]',
        'bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/50',
        'transition-transform hover:scale-105 active:scale-95',
        'focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none'
      )}
    >
      <span className="relative flex items-center justify-center">
        <Icon name="clipboard-list" size="lg" />
        {answeredCount > 0 ? (
          <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
            {answeredCount}
          </span>
        ) : null}
      </span>
    </button>,
    document.body
  );
}
