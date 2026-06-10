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
import { ProfileHeroCard } from '../components/profile/ProfileHeroCard';
import { ProfileCoursesSection } from '../components/profile/ProfileCoursesSection';
import { ProfileStatsSection } from '../components/profile/ProfileStatsSection';
import { ProfileAchievementsSection } from '../components/profile/ProfileAchievementsSection';
import { ProfileStoreHighlights } from '../components/profile/ProfileStoreHighlights';
import { PublicProfileErrorState } from '../components/profile/PublicProfileErrorState';
import { PublicProfileChrome } from '../components/profile/PublicProfileChrome';
import { ReportUserDialog } from '../components/ReportUserDialog';

const profileActionButtonClass = cn(
  'flex cursor-pointer items-center gap-2 rounded-lg border border-surface-border bg-surface-elevated p-2 text-sm font-medium',
  'text-app-accent-strong transition-colors hover:bg-surface-via',
  'dark:border-transparent dark:bg-slate-800 dark:text-app-accent dark:hover:bg-slate-700'
);

type PerfilPublicoProps = {
  view: PublicProfileViewState;
};

export const PerfilPublico = ({ view }: PerfilPublicoProps) => {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const {
    userId,
    errorCode,
    exists,
    profileImage,
    name,
    personalPhrase,
    createdAt,
    level,
    totalXP,
    levelInfo,
    achievements,
    coursesProgress,
    hasVipBadge,
    storeHighlights,
  } = view;

  const isOwnProfile = Boolean(authUser?.uid && userId === authUser.uid);
  const ownVip = useVipBadge();
  const { inventory, equippedLogoId } = useShop();
  const [copied, setCopied] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportAcknowledged, setReportAcknowledged] = useState(false);

  const displayStoreHighlights = useMemo(() => {
    if (storeHighlights.length > 0) return storeHighlights;
    if (isOwnProfile) return buildProfileStoreHighlights(inventory, equippedLogoId);
    return [];
  }, [storeHighlights, isOwnProfile, inventory, equippedLogoId]);

  const displayVip = hasVipBadge || (isOwnProfile && (ownVip || checkVipBadge(inventory)));

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReportClick = () => {
    setReportDialogOpen(true);
  };

  const handleReportSuccess = () => {
    setReportAcknowledged(true);
    window.setTimeout(() => setReportAcknowledged(false), 4000);
  };

  return (
    <ProfilePageLayout glowVariant="public">
      <PublicProfileChrome />
      {isOwnProfile && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/perfil')}
            className={cn(
              'text-app-accent hover:text-app-accent-muted inline-flex cursor-pointer items-center gap-2 text-sm font-semibold transition-colors',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface'
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
                onClick={handleReportClick}
                className={cn(
                  'border-surface-border bg-surface-elevated cursor-pointer rounded-lg border p-2 transition-colors',
                  'hover:bg-red-50 dark:border-transparent dark:bg-slate-800 dark:hover:bg-red-900/30',
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {displayStoreHighlights.length > 0 && (
            <ProfileStoreHighlights
              highlights={displayStoreHighlights}
              title="Colección de la tienda"
              emptyMessage="Este usuario aún no tiene ítems de la tienda."
            />
          )}
          <ProfileStatsSection
            achievements={achievements}
            level={level}
            totalXP={totalXP}
            title="Estadísticas"
            showRanking={false}
          />
          <ProfileCoursesSection
            coursesProgress={coursesProgress}
            emptyMessage="Este usuario aún no ha iniciado cursos."
          />
        </div>
        <div className="lg:col-span-1">
          <ProfileAchievementsSection achievements={achievements} />
        </div>
      </div>

      <ReportUserDialog
        isOpen={reportDialogOpen}
        reportedUserId={userId}
        reportedUserName={name}
        profileUrl=""
        isAuthenticated={Boolean(authUser?.uid)}
        reporterEmail={authUser?.email}
        onClose={() => setReportDialogOpen(false)}
        onSuccess={handleReportSuccess}
      />
    </ProfilePageLayout>
  );
};
