import React from 'react';

import { Header } from '@/shared/components/Header';
import { ClientChecker } from '@/features/store/hooks/ClientChecker';

import { cn } from '@/utils/cn';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-linear-to-b from-black via-slate-950 to-black">
      <ClientChecker />

      <div className="flex h-screen w-screen flex-col-reverse lg:flex-row">
        {/* Header - Sidebar */}
        <Header
          className={cn(
            'hidden h-screen w-fit flex-col border-r border-cyan-500/20 bg-slate-950/95',
            'shadow-2xl shadow-cyan-500/10 backdrop-blur-xl transition-all duration-300 lg:flex'
          )}
        />

        {/* Main Content Area */}
        <main className="h-screen w-full flex-1 overflow-y-scroll transition-all duration-300 lg:w-auto lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
