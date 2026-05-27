import ReduxProvider from '@/components/ReduxProvider';
import { AuthProvider } from '@/features/auth/context/AuthContext';

/** Redux: client UI session (`uiSession`). User auth/session stays in AuthProvider (Supabase). */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReduxProvider>
  );
}
