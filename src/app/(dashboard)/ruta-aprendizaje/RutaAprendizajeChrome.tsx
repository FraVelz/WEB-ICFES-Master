'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { ChatAssistant } from '@/features/learning/shell/ChatAssistant/ChatAssistant';
import { isLessonRoute } from '@/features/learning/utils/lessonRoutes';

type RutaAprendizajeChromeProps = {
  children: ReactNode;
  /** Server-resolved OpenAI gate (flag + key). When false, launcher is not mounted. */
  openaiEnabled?: boolean;
};

export function RutaAprendizajeChrome({ children, openaiEnabled = false }: RutaAprendizajeChromeProps) {
  const pathname = usePathname();
  const hideAssistant = isLessonRoute(pathname) || !openaiEnabled;

  return (
    <>
      {children}
      {!hideAssistant && <ChatAssistant />}
    </>
  );
}
