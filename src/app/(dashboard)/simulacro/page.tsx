import ProtectedPage from '@/components/ProtectedPage';
import { SimulacroHubPage } from '@/features/exam/pages/SimulacroHubPage';

export default function Page() {
  return (
    <ProtectedPage>
      <SimulacroHubPage />
    </ProtectedPage>
  );
}
