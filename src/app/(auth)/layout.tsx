export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-dvh flex-col bg-linear-to-b from-black via-slate-950 to-black">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute top-2/3 left-3/4 h-72 w-72 animate-pulse rounded-full bg-indigo-500/20 blur-3xl" />
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
