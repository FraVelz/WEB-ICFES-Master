import ProtectedPage from '@/components/ProtectedPage';
import TipsPage from '@/features/tips';

export default function Page() {
  return (
    <ProtectedPage blockDemoContent={false}>
      <TipsPage />
    </ProtectedPage>
  );
}
