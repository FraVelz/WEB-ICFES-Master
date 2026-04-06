'use client';

import { cn } from '@/utils/cn';
import React from 'react';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';

export interface LessonPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    id?: string;
    title?: string;
    content?: string;
    description?: string;
    xp?: number;
    coins?: number;
    lessonHref?: string;
  } | null;
  onStart: (lesson?: { id?: string }) => void;
}

export const LessonPreview = ({ isOpen, onClose, lesson, onStart }: LessonPreviewProps) => {
  const backdropRef = useGSAPModalEntrance({
    isOpen,
    type: 'fade',
    duration: 0.2,
  });
  const contentRef = useGSAPModalEntrance({
    isOpen,
    type: 'slideUp',
    duration: 0.3,
  });

  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div ref={backdropRef} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative mb-20 w-screen max-w-md border-t border-slate-700 bg-slate-900 p-6 shadow-2xl sm:rounded-2xl sm:border"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer p-2 text-slate-400 transition-colors hover:text-white"
        >
          <Icon name="times" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h3 className="mr-8 mb-2 text-xl font-bold text-white">{lesson.title}</h3>
          <p className="text-sm text-slate-400">{lesson.description}</p>
        </div>

        {/* Rewards */}
        <div className="mb-8 flex justify-center gap-4">
          <div className="flex min-w-[100px] flex-col items-center rounded-xl border border-slate-700 bg-slate-800/50 p-3">
            <span className="text-lg font-bold text-orange-400">+{lesson?.xp ?? 0}</span>
            <span className="text-xs tracking-wider text-slate-500 uppercase">XP</span>
          </div>
          <div className="flex min-w-[100px] flex-col items-center rounded-xl border border-slate-700 bg-slate-800/50 p-3">
            <span className="text-lg font-bold text-yellow-400">+{lesson?.coins ?? 0}</span>
            <span className="text-xs tracking-wider text-slate-500 uppercase">Monedas</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onStart(lesson);
            onClose();
          }}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-500 py-4',
            'font-bold text-slate-900 shadow-lg shadow-green-500/20 transition-all hover:bg-green-400',
            'active:scale-95'
          )}
        >
          <Icon name="play" />
          COMENZAR LECCIÓN
        </button>

        {lesson.lessonHref && (
          <Link
            href={lesson.lessonHref}
            onClick={onClose}
            className={cn(
              'mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-slate-800/50',
              'py-3 text-sm font-semibold text-cyan-300 transition-colors hover:bg-slate-800 hover:text-cyan-200'
            )}
          >
            <Icon name="arrow-right" size="sm" />
            Ir a lección interactiva (paso a paso)
          </Link>
        )}
      </div>
    </div>
  );
};
