'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useProfileStatus } from '@/features/user/hooks/useProfileStatus';
import { useResolvedProfileAvatar } from '@/features/user/hooks/useResolvedProfileAvatar';
import { useVipBadge } from '@/features/store/hooks/useVipBadge';
import { getRankInfo } from '@/shared/constants/ranks';
import { LeagueShieldNav } from './LeagueShieldNav';
import { LeagueSkeletonRows } from './LeagueSkeletonRows';
import { LeaguePinnedUserRow } from './LeaguePinnedUserRow';

export function LigasComingSoonView() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedRank, setSelectedRank] = useState('novato');
  const { statusId } = useProfileStatus();
  const avatarSrc = useResolvedProfileAvatar(user?.profileImage);
  const hasVip = useVipBadge();
  const currentRankInfo = getRankInfo(selectedRank);

  return (
    <div className="relative z-10 mx-auto flex min-h-[70dvh] max-w-2xl flex-col px-4 pb-4">
      <h1 className="sr-only">Ligas semanales</h1>
      <LeagueShieldNav selectedRank={selectedRank} myLeagueRank="novato" onSelect={setSelectedRank} />

      <div className="mb-5 text-center">
        <h2 className="text-lg font-bold text-white sm:text-xl">División {currentRankInfo.label}</h2>
        <p
          className={cn(
            'border-surface-border bg-surface-elevated/60 text-on-surface-muted mx-auto mt-4 max-w-md',
            'rounded-2xl border px-4 py-3 text-sm leading-relaxed'
          )}
        >
          Las ligas semanales están en preparación. Muy pronto podrás competir con otros estudiantes por ascender de
          división.
        </p>
      </div>

      <div className="min-h-0 flex-1">
        <LeagueSkeletonRows count={10} />
        {user ? (
          <LeaguePinnedUserRow
            name={user.displayName || 'Tú'}
            profileImage={avatarSrc}
            weeklyXp={0}
            position={null}
            hasVip={hasVip}
            statusId={statusId}
            onClick={() => router.push('/perfil')}
          />
        ) : null}
      </div>
    </div>
  );
}
