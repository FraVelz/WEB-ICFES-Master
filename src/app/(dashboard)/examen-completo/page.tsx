'use client';
import ProtectedPage from '@/components/ProtectedPage';
import { FullExamPage } from '@/features/exam/pages';
export default function Page() {
  return (
    <ProtectedPage>
      <FullExamPage />
    </ProtectedPage>
  );
}
