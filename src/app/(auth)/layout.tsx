'use client';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-to-b from-black via-slate-950 to-black relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-2/3 left-3/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
