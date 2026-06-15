import ProtectedPage from '@/components/ProtectedPage';
import { LigasPage } from '@/features/exam/pages';

export default function Page() {
  return (
    <ProtectedPage
      authGateTitle="Ligas solo con cuenta"
      authGateMessage="Compite en el ranking semanal y sigue tu posición iniciando sesión o creando una cuenta gratuita."
    >
      <LigasPage />
    </ProtectedPage>
  );
}
