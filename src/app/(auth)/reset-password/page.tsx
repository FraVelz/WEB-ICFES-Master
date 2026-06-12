import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ResetPasswordPage } from '@/features/auth';
import { LoadingState } from '@/shared/components/LoadingState';

export const metadata: Metadata = {
  title: 'Restablecer contraseña',
  description: 'Define una nueva contraseña para tu cuenta ICFES Master.',
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingState label="Cargando..." layout="page" />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
