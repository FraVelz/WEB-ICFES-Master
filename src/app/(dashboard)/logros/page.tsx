import ProtectedPage from '@/components/ProtectedPage';
import LogrosPage from '@/features/achievements';

export default function Page() {
  return (
    <ProtectedPage blockDemoContent={false}>
      <LogrosPage />
    </ProtectedPage>
  );
}
