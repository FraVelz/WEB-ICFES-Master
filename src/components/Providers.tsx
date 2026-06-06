import ReduxProvider from '@/components/ReduxProvider';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ThemeProvider } from '@/features/theme/context/ThemeContext';

/** Redux: client UI session (`uiSession`). User auth/session stays in AuthProvider (Supabase). */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <AuthProvider>{children}</AuthProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
