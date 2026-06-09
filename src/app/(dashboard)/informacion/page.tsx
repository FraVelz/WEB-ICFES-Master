import ProtectedPage from '@/components/ProtectedPage';
import InformacionPage from '@/features/informacion';

export default function Page() {
  return (
    <ProtectedPage blockDemoContent={false}>
      <InformacionPage />
    </ProtectedPage>
  );
}
