import ProtectedPage from '@/components/ProtectedPage';
import { ProgressPage } from '@/features/progress/pages/ProgressPage';

export default function ProgresoRoutePage() {
  return (
    <ProtectedPage>
      <ProgressPage />
    </ProtectedPage>
  );
}
