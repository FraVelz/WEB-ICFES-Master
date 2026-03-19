'use client';
import ProtectedPage from '@/components/ProtectedPage';
import { ClasificatoriaPage } from '@/features/exam/pages';
export default function Page() {
  return (
    <ProtectedPage>
      <ClasificatoriaPage />
    </ProtectedPage>
  );
}
