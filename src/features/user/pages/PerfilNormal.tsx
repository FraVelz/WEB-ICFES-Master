'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { LoadingState } from '@/shared/components/LoadingState';
import { useVipBadge } from '@/features/store/hooks/useVipBadge';
import { useShop } from '@/features/store/hooks/useShop';
import { useUserProfile } from '../hooks/useUserProfile';
import { useResolvedProfileAvatar } from '@/features/user/hooks/useResolvedProfileAvatar';
import { buildProfileStoreHighlights } from '@/features/user/utils/profileStoreHighlights';
import { ProfilePageLayout } from '../components/profile/ProfilePageLayout';
import { ProfileMainGrid } from '../components/profile/ProfileMainGrid';
import { ProfileHeroCard } from '../components/profile/ProfileHeroCard';
import { ProfileCoursesSection } from '../components/profile/ProfileCoursesSection';
import { ProfileStatsSection } from '../components/profile/ProfileStatsSection';
import { ProfileAchievementsSection } from '../components/profile/ProfileAchievementsSection';
import { ProfileLeagueSection } from '../components/profile/ProfileLeagueSection';
import { ProfileStoreHighlights } from '../components/profile/ProfileStoreHighlights';
import { mapMyLeagueToDisplay } from '../components/profile/profileLeagueTypes';
import { useMyLeague } from '@/hooks/gamification/useMyLeague';
import { useProfileCourseProgress } from '../hooks/useProfileCourseProgress';

const profileActionButtonClass = cn(
  'flex cursor-pointer items-center gap-2 rounded-lg border border-surface-border',
  'bg-surface-elevated p-2 text-sm font-medium text-app-accent-strong transition-colors duration-200',
  'hover:border-app-ring/30 hover:bg-surface-via',
  'dark:border-surface-border/40 dark:bg-surface-overlay/60 dark:text-app-accent',
  'dark:hover:border-app-ring/35 dark:hover:bg-app-ring/15 dark:hover:text-app-accent-bright',
  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated'
);

export const PerfilNormal = () => {
  const router = useRouter();
  const {
    uid,
    profileImage,
    name,
    personalPhrase,
    createdAt,
    level,
    totalXP,
    levelInfo,
    achievements,
    loading,
    gamificationLoading,
    studyTimeMinutes,
  } = useUserProfile();
  const displayProfileImage = useResolvedProfileAvatar(profileImage);
  const isVip = useVipBadge();
  const { inventory, equippedLogoId } = useShop();
  const { leagueState, leagueRank, loading: leagueLoading, resetMs } = useMyLeague();
  const { courseProgress, loading: courseProgressLoading } = useProfileCourseProgress(uid);

  const leagueDisplay = useMemo(() => mapMyLeagueToDisplay(leagueState, leagueRank), [leagueState, leagueRank]);

  const storeHighlights = useMemo(
    () => buildProfileStoreHighlights(inventory, equippedLogoId),
    [inventory, equippedLogoId]
  );

  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/perfil/public?userId=${encodeURIComponent(uid ?? '')}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return <LoadingState label="Cargando tu perfil..." layout="fill" />;
  }

  return (
    <ProfilePageLayout showThemeControl={false}>
      <ProfileHeroCard
        profileImage={displayProfileImage}
        name={name}
        personalPhrase={personalPhrase}
        createdAt={createdAt}
        level={level}
        totalXP={totalXP}
        levelInfo={levelInfo}
        isVip={isVip}
        onEditProfile={() => router.push('/configuracion')}
        headerActions={
          <button
            type="button"
            onClick={handleShare}
            className={profileActionButtonClass}
            title="Copiar enlace público"
          >
            <Icon name={copied ? 'check' : 'share-nodes'} />
            <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Compartir'}</span>
          </button>
        }
      />

      <ProfileMainGrid
        stats={
          <ProfileStatsSection
            achievements={achievements}
            level={level}
            totalXP={totalXP}
            studyTimeMinutes={studyTimeMinutes}
          />
        }
        courses={
          <ProfileCoursesSection
            courseProgress={courseProgress}
            loading={courseProgressLoading}
            emptyMessage="Aún no has iniciado ningún curso."
            onStartLearning={() => router.push('/ruta-aprendizaje')}
          />
        }
        store={
          <ProfileStoreHighlights highlights={storeHighlights} expanded onGoToStore={() => router.push('/tienda')} />
        }
        league={<ProfileLeagueSection league={leagueDisplay} loading={leagueLoading} showCta resetMs={resetMs} />}
        achievements={
          <ProfileAchievementsSection
            achievements={achievements}
            loading={gamificationLoading}
            showViewAll
            onViewAll={() => router.push('/logros')}
          />
        }
      />
    </ProfilePageLayout>
  );
};
