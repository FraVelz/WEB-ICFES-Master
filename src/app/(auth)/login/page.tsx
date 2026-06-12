import { Suspense } from 'react';
import type { Metadata } from 'next';
import { LoginPage } from '@/features/auth';
import { LoadingState } from '@/shared/components/LoadingState';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Accede a tu cuenta de ICFES Master para continuar tu preparación.',
};

export default function Page() {
  return (
    <Suspense fallback={<LoadingState label="Cargando..." layout="page" />}>
      <LoginPage />
    </Suspense>
  );
}
