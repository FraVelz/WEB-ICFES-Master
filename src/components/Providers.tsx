import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ThemeProvider } from '@/features/theme/context/ThemeContext';
import { ToastProvider } from '@/shared/components/Toast/ToastProvider';
import { QueryProvider } from '@/components/QueryProvider';

import { LearningProgressHydrator } from './LearningProgressHydrator';
import { UiSessionHydrator } from './UiSessionHydrator';
import { StudyTimeTracker } from './StudyTimeTracker';

/** Zustand: client UI session (`uiSession`). User auth/session stays in AuthProvider (Supabase). */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <QueryProvider>
          <UiSessionHydrator />
          <AuthProvider>
            <LearningProgressHydrator />
            <StudyTimeTracker />
            {children}
          </AuthProvider>
        </QueryProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
