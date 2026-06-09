import { Suspense } from 'react';
import { LoadingState } from '@/shared/components/LoadingState';
import { PerfilPublico } from '@/features/user/pages';

export default function Page() {
  return (
    <Suspense fallback={<LoadingState label="Cargando perfil público..." layout="page" />}>
      <PerfilPublico />
    </Suspense>
  );
}
