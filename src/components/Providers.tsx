import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ThemeProvider } from '@/features/theme/context/ThemeContext';

import { UiSessionHydrator } from './UiSessionHydrator';

/** Zustand: client UI session (`uiSession`). User auth/session stays in AuthProvider (Supabase). */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <UiSessionHydrator />
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
