import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ResetPasswordPage } from '@/features/auth';
import { AuthPageSkeleton } from '@/shared/components/PageSkeletons';

export const metadata: Metadata = {
  title: 'Restablecer contraseña',
  description: 'Define una nueva contraseña para tu cuenta ICFES Master.',
};

export default function Page() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
