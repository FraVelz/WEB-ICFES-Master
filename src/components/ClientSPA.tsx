'use client';

import dynamic from 'next/dynamic';

const AppWithProviders = dynamic(
  () => import('@/components/AppWithProviders').then((m) => m.default),
  { ssr: false }
);

export default function ClientSPA() {
  return (
    <div id="root" className="h-[100dvh] w-full flex flex-col">
      <AppWithProviders />
    </div>
  );
}
