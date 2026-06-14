import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginPage } from '@/features/auth';
import { AuthPageSkeleton } from '@/shared/components/PageSkeletons';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Accede a tu cuenta de ICFES Master para continuar tu preparación.',
};

export default function Page() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <LoginPage />
    </Suspense>
  );
}
