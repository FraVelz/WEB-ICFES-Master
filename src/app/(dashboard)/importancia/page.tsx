import ProtectedPage from '@/components/ProtectedPage';
import ImportanciaPage from '@/features/importancia';

export default function Page() {
  return (
    <ProtectedPage blockDemoContent={false}>
      <ImportanciaPage />
    </ProtectedPage>
  );
}
