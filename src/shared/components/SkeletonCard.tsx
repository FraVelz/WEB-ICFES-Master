import { cn } from '@/utils/cn';

type SkeletonCardProps = {
  className?: string;
};

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/60 animate-pulse rounded-2xl border p-4 motion-reduce:animate-none',
        className
      )}
      aria-hidden="true"
    >
      <div className="bg-surface-border mb-3 h-32 rounded-xl" />
      <div className="bg-surface-border mb-2 h-4 w-3/4 rounded" />
      <div className="bg-surface-border h-3 w-1/2 rounded" />
    </div>
  );
}

type SkeletonGridProps = {
  count?: number;
  columnsClassName?: string;
  className?: string;
};

export function SkeletonGrid({ count = 6, columnsClassName = 'grid-cols-2 md:grid-cols-3', className }: SkeletonGridProps) {
  return (
    <div className={cn('grid gap-4', columnsClassName, className)} role="status" aria-label="Cargando contenido">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
