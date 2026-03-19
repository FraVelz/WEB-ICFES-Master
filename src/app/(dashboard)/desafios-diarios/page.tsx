'use client';
import ProtectedPage from '@/components/ProtectedPage';
import { DailyChallengesPage } from '@/features/logros/pages';
export default function Page() {
  return (
    <ProtectedPage>
      <DailyChallengesPage />
    </ProtectedPage>
  );
}
