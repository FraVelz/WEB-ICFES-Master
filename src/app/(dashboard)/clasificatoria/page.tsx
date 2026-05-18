import ProtectedPage from '@/components/ProtectedPage';
import { ClasificatoriaPage } from '@/features/exam/pages';

export default function Page() {
  return (
    <ProtectedPage
      authGateTitle="Clasificatoria solo con cuenta"
      authGateMessage="Compite en el ranking y sigue tu posición iniciando sesión o creando una cuenta gratuita."
    >
      <ClasificatoriaPage />
    </ProtectedPage>
  );
}
