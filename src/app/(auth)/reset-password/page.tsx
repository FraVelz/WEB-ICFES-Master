import { Suspense } from 'react';
import { ResetPasswordPage } from '@/features/auth';
import { LoadingState } from '@/shared/components/LoadingState';

export default function Page() {
  return (
    <Suspense fallback={<LoadingState label="Cargando..." layout="page" />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
