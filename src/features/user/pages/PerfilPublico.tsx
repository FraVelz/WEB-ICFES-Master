'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useShop } from '@/features/store/hooks/useShop';
import { useVipBadge } from '@/features/store/hooks/useVipBadge';
import { hasVipBadge as checkVipBadge } from '@/features/store/constants/vipBadge';
import { buildProfileStoreHighlights } from '@/features/user/utils/profileStoreHighlights';
import type { PublicProfileViewState } from '@/services/profile/publicProfileView';
import { ProfilePageLayout } from '../components/profile/ProfilePageLayout';
import { ProfileMainGrid } from '../components/profile/ProfileMainGrid';
import { ProfileHeroCard } from '../components/profile/ProfileHeroCard';
import { ProfileCoursesSection } from '../components/profile/ProfileCoursesSection';
import { ProfileStatsSection } from '../components/profile/ProfileStatsSection';
import { ProfileAchievementsSection } from '../components/profile/ProfileAchievementsSection';
import { ProfileLeagueSection } from '../components/profile/ProfileLeagueSection';
import { ProfileStoreHighlights } from '../components/profile/ProfileStoreHighlights';
import { useMyLeague } from '@/hooks/gamification/useMyLeague';
import { useProfileCourseProgress } from '../hooks/useProfileCourseProgress';
import { useUserProfileStudyTime } from '../hooks/useUserProfileStudyTime';
import { mapMyLeagueToDisplay } from '../components/profile/profileLeagueTypes';
import { PublicProfileChrome } from '../components/profile/PublicProfileChrome';
import { PublicProfileGate } from '../components/profile/PublicProfileGate';
import { ReportUserDialog } from '../components/ReportUserDialog';
import { useToast } from '@/shared/components/Toast/ToastProvider';

const profileActionButtonClass = cn(
  'flex cursor-pointer items-center gap-2 rounded-lg border border-surface-border bg-surface-elevated p-2',
  'text-sm font-medium text-app-accent-strong transition-colors duration-200',
  'hover:border-app-ring/30 hover:bg-surface-via',
  'dark:border-surface-border/40 dark:bg-surface-overlay/60 dark:text-app-accent',
  'dark:hover:border-app-ring/35 dark:hover:bg-app-ring/15 dark:hover:text-app-accent-bright',
  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
  'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated'
);

type PerfilPublicoProps = {
  view: PublicProfileViewState;
};

export const PerfilPublico = ({ view }: PerfilPublicoProps) => {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const {
    userId,
    profileImage,
    name,
    personalPhrase,
    createdAt,
    level,
    totalXP,
    levelInfo,
    achievements,
    courseProgress: publicCourseProgress,
    studyTimeMinutes: publicStudyTimeMinutes,
    hasVipBadge,
    storeHighlights,
    league,
  } = view;

  const isOwnProfile = Boolean(authUser?.uid && userId === authUser.uid);
  const { leagueState, leagueRank, loading: ownLeagueLoading, resetMs } = useMyLeague();
  const ownLeagueDisplay = useMemo(() => mapMyLeagueToDisplay(leagueState, leagueRank), [leagueState, leagueRank]);
  const { courseProgress: ownCourseProgress, loading: ownCourseProgressLoading } = useProfileCourseProgress(
    isOwnProfile ? (userId ?? undefined) : undefined
  );
  const ownStudyTimeMinutes = useUserProfileStudyTime(isOwnProfile ? (userId ?? undefined) : undefined);
  const ownVip = useVipBadge();
  const { inventory, equippedLogoId } = useShop();
  const [copied, setCopied] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportAcknowledged, setReportAcknowledged] = useState(false);
  const { showToast } = useToast();

  const displayStoreHighlights = useMemo(() => {
    if (storeHighlights.length > 0) return storeHighlights;
    if (isOwnProfile) return buildProfileStoreHighlights(inventory, equippedLogoId);
    return [];
  }, [storeHighlights, isOwnProfile, inventory, equippedLogoId]);

  const displayVip = hasVipBadge || (isOwnProfile && (ownVip || checkVipBadge(inventory)));

  const leagueDisplay = isOwnProfile ? ownLeagueDisplay : league;
  const leagueLoading = isOwnProfile && ownLeagueLoading;
  const courseProgress = isOwnProfile ? ownCourseProgress : publicCourseProgress;
  const courseProgressLoading = isOwnProfile && ownCourseProgressLoading;
  const studyTimeMinutes = isOwnProfile ? ownStudyTimeMinutes : publicStudyTimeMinutes;

  const handleShare = () => {
    void navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      showToast('Enlace del perfil copiado al portapapeles', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <PublicProfileGate view={view} isOwnProfile={isOwnProfile}>
      <ProfilePageLayout glowVariant="public">
        <PublicProfileChrome />
        {isOwnProfile && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/perfil')}
              className={cn(
                'text-app-accent hover:text-app-accent-muted inline-flex cursor-pointer items-center gap-2',
                'focus-visible:ring-app-accent text-sm font-semibold transition-colors focus-visible:ring-2',
                'focus-visible:ring-offset-surface focus-visible:ring-offset-2 focus-visible:outline-none'
              )}
            >
              <Icon name="circle-user" />
              Ver mi perfil privado
            </button>
          </div>
        )}

        <ProfileHeroCard
          profileImage={profileImage}
          name={name}
          personalPhrase={personalPhrase}
          createdAt={createdAt}
          level={level}
          totalXP={totalXP}
          levelInfo={levelInfo}
          accent="purple"
          isVip={displayVip}
          headerActions={
            <>
              <button type="button" onClick={handleShare} className={profileActionButtonClass} title="Copiar enlace">
                <Icon name={copied ? 'check' : 'share-nodes'} />
                <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Compartir'}</span>
              </button>
              {!isOwnProfile && (
                <button
                  type="button"
                  onClick={() => setReportDialogOpen(true)}
                  className={cn(
                    'border-surface-border bg-surface-elevated cursor-pointer rounded-lg border p-2 transition-colors',
                    'dark:bg-surface-overlay hover:bg-red-50 dark:border-transparent dark:hover:bg-red-900/30',
                    reportAcknowledged
                      ? 'text-red-600 dark:text-red-500'
                      : 'text-on-surface-muted hover:text-red-600 dark:hover:text-red-400'
                  )}
                  title={reportAcknowledged ? 'Reporte enviado' : 'Reportar usuario'}
                >
                  <Icon name={reportAcknowledged ? 'check' : 'flag'} />
                </button>
              )}
            </>
          }
        />

        <ProfileMainGrid
          stats={
            <ProfileStatsSection
              achievements={achievements}
              level={level}
              totalXP={totalXP}
              studyTimeMinutes={studyTimeMinutes}
              title="Estadísticas Rápidas"
            />
          }
          courses={
            <ProfileCoursesSection
              courseProgress={courseProgress}
              loading={courseProgressLoading}
              emptyMessage="Este usuario aún no ha iniciado cursos."
            />
          }
          store={
            displayStoreHighlights.length > 0 ? (
              <ProfileStoreHighlights
                highlights={displayStoreHighlights}
                title="Colección de la tienda"
                emptyMessage="Este usuario aún no tiene ítems de la tienda."
                expanded
              />
            ) : null
          }
          league={
            <ProfileLeagueSection
              league={leagueDisplay}
              loading={leagueLoading}
              showCta={isOwnProfile}
              resetMs={isOwnProfile ? resetMs : undefined}
            />
          }
          achievements={<ProfileAchievementsSection achievements={achievements} />}
        />

        <ReportUserDialog
          isOpen={reportDialogOpen}
          reportedUserId={userId!}
          reportedUserName={name}
          profileUrl=""
          isAuthenticated={Boolean(authUser?.uid)}
          reporterEmail={authUser?.email}
          onClose={() => setReportDialogOpen(false)}
          onSuccess={() => {
            setReportAcknowledged(true);
            window.setTimeout(() => setReportAcknowledged(false), 4000);
          }}
        />
      </ProfilePageLayout>
    </PublicProfileGate>
  );
};
