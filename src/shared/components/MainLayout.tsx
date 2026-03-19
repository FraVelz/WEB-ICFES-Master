import React from 'react';
import { Header } from '@/shared/components/Header';

export const MainLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-linear-to-b from-black via-slate-950 to-black">
      {/* Background glow effects - Fixed to viewport */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/30 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>
        <div className="absolute top-2/3 left-3/4 h-72 w-72 animate-pulse rounded-full bg-indigo-500/20 blur-3xl"></div>
      </div>

      {/* Header - Sidebar */}
      <div className="relative z-50 hidden shrink-0 lg:block">
        <Header />
      </div>

      {/* Mobile Header Placeholder (if needed, though Header handles its own mobile view usually) */}
      <div className="fixed top-0 right-0 left-0 z-50 lg:hidden">
        <Header />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 w-full flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 lg:w-auto lg:pt-0">
        {children}
      </main>
    </div>
  );
};
