import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ThemeProvider } from '@/features/theme/context/ThemeContext';
import { ToastProvider } from '@/shared/components/Toast/ToastProvider';

import { LearningProgressHydrator } from './LearningProgressHydrator';
import { LearningProgressHydrator } from './LearningProgressHydrator';
import { UiSessionHydrator } from './UiSessionHydrator';
import { StudyTimeTracker } from './StudyTimeTracker';

/** Zustand: client UI session (`uiSession`). User auth/session stays in AuthProvider (Supabase). */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <UiSessionHydrator />
        <AuthProvider>
          <LearningProgressHydrator />
          <StudyTimeTracker />
          {children}
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
