import React from 'react';
import { Header } from '@/shared/components/Header';

export const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-linear-to-b from-black via-slate-950 to-black relative overflow-hidden">
      {/* Background glow effects - Fixed to viewport */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-2/3 left-3/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header - Sidebar */}
      <div className="hidden lg:block relative z-50 shrink-0">
        <Header />
      </div>

      {/* Mobile Header Placeholder (if needed, though Header handles its own mobile view usually) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 overflow-y-auto overflow-x-hidden w-full lg:w-auto lg:pt-0 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};
