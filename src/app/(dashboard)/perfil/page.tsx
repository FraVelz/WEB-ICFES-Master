import ProtectedPage from '@/components/ProtectedPage';
import { PerfilNormal } from '@/features/user/pages';

export default function Page() {
  return (
    <ProtectedPage
      authGateTitle="Tu perfil requiere una cuenta"
      authGateMessage="Personaliza tu perfil, avatar y estadísticas creando una cuenta o iniciando sesión."
    >
      <PerfilNormal />
    </ProtectedPage>
  );
}
