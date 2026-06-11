'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { ChatAssistant } from '@/features/learning/shell/ChatAssistant/ChatAssistant';
import { isLessonRoute } from '@/features/learning/utils/lessonRoutes';

export function RutaAprendizajeChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideAssistant = isLessonRoute(pathname);

  return (
    <>
      {children}
      {!hideAssistant && <ChatAssistant />}
    </>
  );
}
