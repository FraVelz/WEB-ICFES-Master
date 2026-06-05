'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { LoadingState } from '@/shared/components/LoadingState';
import { useUserProfile } from '../hooks/useUserProfile';
import { ProfilePageLayout } from '../components/profile/ProfilePageLayout';
import { ProfileHeroCard } from '../components/profile/ProfileHeroCard';
import { ProfileCoursesSection } from '../components/profile/ProfileCoursesSection';
import { ProfileStatsSection } from '../components/profile/ProfileStatsSection';
import { ProfileAchievementsSection } from '../components/profile/ProfileAchievementsSection';

export const PerfilNormal = () => {
  const router = useRouter();
  const {
    uid,
    photoUrl,
    name,
    personalPhrase,
    createdAt,
    level,
    totalXP,
    levelInfo,
    achievements,
    coursesProgress,
    loading,
  } = useUserProfile();

  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/perfil/public?userId=${uid}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return <LoadingState label="Cargando tu perfil..." layout="page" />;
  }

  return (
    <ProfilePageLayout>
      <ProfileHeroCard
        photoUrl={photoUrl}
        name={name}
        personalPhrase={personalPhrase}
        createdAt={createdAt}
        level={level}
        totalXP={totalXP}
        levelInfo={levelInfo}
        onEditProfile={() => router.push('/configuracion')}
        headerActions={
          <button
            type="button"
            onClick={handleShare}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-lg bg-slate-800 p-2 text-sm font-medium',
              'text-app-accent transition-colors hover:bg-slate-700'
            )}
            title="Copiar enlace público"
          >
            <Icon name={copied ? 'check' : 'share-nodes'} />
            <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Compartir'}</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <ProfileCoursesSection
            coursesProgress={coursesProgress}
            emptyMessage="Aún no has iniciado ningún curso."
            onStartLearning={() => router.push('/ruta-aprendizaje')}
          />
          <ProfileStatsSection achievements={achievements} level={level} totalXP={totalXP} />
        </div>
        <div className="lg:col-span-1">
          <ProfileAchievementsSection
            achievements={achievements}
            showViewAll
            onViewAll={() => router.push('/logros')}
          />
        </div>
      </div>
    </ProfilePageLayout>
  );
};
