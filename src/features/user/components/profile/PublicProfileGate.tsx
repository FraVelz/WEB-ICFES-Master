import type { PublicProfileViewState } from '@/services/profile/publicProfileView';
import { PublicProfileChrome } from './PublicProfileChrome';
import { PublicProfileErrorState } from './PublicProfileErrorState';

type PublicProfileGateProps = {
  view: PublicProfileViewState;
  isOwnProfile: boolean;
  children: React.ReactNode;
};

export function PublicProfileGate({ view, isOwnProfile, children }: PublicProfileGateProps) {
  const { userId, errorCode, exists } = view;

  if (!userId || errorCode === 'invalid_id') {
    return (
      <div className="from-surface via-surface-via to-surface min-h-dvh bg-linear-to-b px-4 py-6">
        <div className="container mx-auto max-w-6xl">
          <PublicProfileChrome />
          <PublicProfileErrorState errorCode="invalid_id" userId={userId} isOwnProfile={isOwnProfile} />
        </div>
      </div>
    );
  }

  if (!exists) {
    return (
      <div className="from-surface via-surface-via to-surface min-h-dvh bg-linear-to-b px-4 py-6">
        <div className="container mx-auto max-w-6xl">
          <PublicProfileChrome />
          <PublicProfileErrorState errorCode={errorCode ?? 'not_found'} userId={userId} isOwnProfile={isOwnProfile} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
