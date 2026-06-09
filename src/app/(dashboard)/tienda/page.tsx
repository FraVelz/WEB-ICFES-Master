import ProtectedPage from '@/components/ProtectedPage';
import { StorePage } from '@/features/store/pages/StorePage';

export default function Page() {
  return (
    <ProtectedPage blockDemoContent={false}>
      <StorePage />
    </ProtectedPage>
  );
}
