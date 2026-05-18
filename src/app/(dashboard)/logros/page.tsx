import ProtectedPage from '@/components/ProtectedPage';
import LogrosPage from '@/features/logros';

export default function Page() {
  return (
    <ProtectedPage blockDemoContent={false}>
      <LogrosPage />
    </ProtectedPage>
  );
}
