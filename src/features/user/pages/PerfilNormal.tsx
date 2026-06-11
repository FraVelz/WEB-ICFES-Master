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
import { ProfileHeroCard } from '../components/profile/ProfileHeroCard';
import { ProfileCoursesSection } from '../components/profile/ProfileCoursesSection';
import { ProfileStatsSection } from '../components/profile/ProfileStatsSection';
import { ProfileAchievementsSection } from '../components/profile/ProfileAchievementsSection';
import { ProfileStoreHighlights } from '../components/profile/ProfileStoreHighlights';

const profileActionButtonClass = cn(
  'flex cursor-pointer items-center gap-2 rounded-lg border ' +
    'border-surface-border bg-surface-elevated p-2 text-sm font-medium',
  'text-app-accent-strong transition-colors hover:bg-surface-via',
  'dark:border-transparent dark:bg-slate-800 dark:text-app-accent dark:hover:bg-slate-700'
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
    coursesProgress,
    loading,
    gamificationLoading,
    studyTimeMinutes,
  } = useUserProfile();
  const displayProfileImage = useResolvedProfileAvatar(profileImage);
  const isVip = useVipBadge();
  const { inventory, equippedLogoId } = useShop();

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
    <ProfilePageLayout>
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <ProfileStoreHighlights highlights={storeHighlights} onGoToStore={() => router.push('/tienda')} />
          <ProfileCoursesSection
            coursesProgress={coursesProgress}
            emptyMessage="Aún no has iniciado ningún curso."
            onStartLearning={() => router.push('/ruta-aprendizaje')}
          />
          <ProfileStatsSection
            achievements={achievements}
            level={level}
            totalXP={totalXP}
            studyTimeMinutes={studyTimeMinutes}
          />
        </div>
        <div className="lg:col-span-1">
          <ProfileAchievementsSection
            achievements={achievements}
            loading={gamificationLoading}
            showViewAll
            onViewAll={() => router.push('/logros')}
          />
        </div>
      </div>
    </ProfilePageLayout>
  );
};
