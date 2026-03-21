// Componente de Layout reutilizable para mantener consistencia

export const OnboardingLayout = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative flex min-h-dvh flex-col bg-linear-to-b from-black via-slate-950 to-black text-white ${className}`}
  >
    {/* Background glow effects - Fixed position */}
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/30 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>
    </div>
    {/* Content wrapper */}
    <div className="relative z-10 flex w-full flex-1 flex-col">{children}</div>
  </div>
);
