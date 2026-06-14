import ProtectedPage from '@/components/ProtectedPage';
import { SimulacroCompletoSectionPage } from '@/features/exam/pages/SimulacroCompletoSectionPage';

export default function Page() {
  return (
    <ProtectedPage blockDemoContent={false}>
      <SimulacroCompletoSectionPage />
    </ProtectedPage>
  );
}
