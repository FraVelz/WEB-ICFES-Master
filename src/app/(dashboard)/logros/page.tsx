'use client';
import DemoProtectedPage from '@/components/DemoProtectedPage';
import LogrosPage from '@/features/logros';
export default function Page() {
  return (
    <DemoProtectedPage>
      <LogrosPage />
    </DemoProtectedPage>
  );
}
