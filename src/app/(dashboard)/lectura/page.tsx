import ProtectedPage from '@/components/ProtectedPage';
import LecturaPage from '@/features/lectura';

export default function Page() {
  return (
    <ProtectedPage blockDemoContent={false}>
      <LecturaPage />
    </ProtectedPage>
  );
}
