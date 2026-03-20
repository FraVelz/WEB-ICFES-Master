import ProtectedPage from '@/components/ProtectedPage';
import { UserSettingsPage } from '@/features/user/pages';

export default function Page() {
  return (
    <ProtectedPage>
      <UserSettingsPage />
    </ProtectedPage>
  );
}
