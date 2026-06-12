import type { ReactNode } from 'react';
import { ContentPageShell } from '@/features/content/components/ContentPageShell';

export default function ContentLayout({ children }: { children: ReactNode }) {
  return <ContentPageShell>{children}</ContentPageShell>;
}
