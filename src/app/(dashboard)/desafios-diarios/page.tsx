import ProtectedPage from '@/components/ProtectedPage';
import { DailyChallengesPage } from '@/features/achievements/pages';

export default function Page() {
  return (
    <ProtectedPage
      authGateTitle="Desafíos diarios solo con cuenta"
      authGateMessage="Los desafíos diarios y sus recompensas requieren una cuenta. Inicia sesión o regístrate para participar."
    >
      <DailyChallengesPage />
    </ProtectedPage>
  );
}
