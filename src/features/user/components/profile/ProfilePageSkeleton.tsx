import { cn } from '@/utils/cn';
import { ProfilePageLayout } from './ProfilePageLayout';
import { ProfileMainGrid } from './ProfileMainGrid';

const pulseBlock = 'bg-surface-border animate-pulse rounded motion-reduce:animate-none';

function ProfileSectionSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('border-surface-border bg-surface-elevated/60 rounded-2xl border p-4', className)}
      aria-hidden="true"
    >
      <div className={cn(pulseBlock, 'mb-4 h-5 w-1/3')} />
      <div className={cn(pulseBlock, 'mb-2 h-4 w-full')} />
      <div className={cn(pulseBlock, 'h-4 w-2/3')} />
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <ProfilePageLayout showThemeControl={false}>
      <div
        className="border-surface-border bg-surface-elevated/60 mb-6 rounded-3xl border p-6"
        role="status"
        aria-label="Cargando perfil"
      >
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className={cn(pulseBlock, 'h-24 w-24 shrink-0 rounded-full')} />
          <div className="w-full flex-1 space-y-3">
            <div className={cn(pulseBlock, 'mx-auto h-7 w-48 sm:mx-0')} />
            <div className={cn(pulseBlock, 'mx-auto h-4 w-64 sm:mx-0')} />
            <div className={cn(pulseBlock, 'mx-auto h-10 w-32 sm:mx-0')} />
          </div>
        </div>
      </div>

      <ProfileMainGrid
        stats={<ProfileSectionSkeleton />}
        courses={<ProfileSectionSkeleton className="min-h-[180px]" />}
        store={<ProfileSectionSkeleton />}
        league={<ProfileSectionSkeleton />}
        achievements={<ProfileSectionSkeleton className="min-h-[200px]" />}
      />
    </ProfilePageLayout>
  );
}
