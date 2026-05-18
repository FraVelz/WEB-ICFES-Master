import ProtectedPage from '@/components/ProtectedPage';
import { UserSettingsPage } from '@/features/user/pages';

export default function Page() {
  return (
    <ProtectedPage
      authGateTitle="Configuración solo con cuenta"
      authGateMessage="Ajustes de cuenta, privacidad y datos personales están disponibles tras iniciar sesión o registrarte."
    >
      <UserSettingsPage />
    </ProtectedPage>
  );
}
