'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useUserProfile } from '../hooks/useUserProfile';
import { ProfilePageLayout } from '../components/profile/ProfilePageLayout';
import { ProfileHeroCard } from '../components/profile/ProfileHeroCard';
import { ProfileCoursesSection } from '../components/profile/ProfileCoursesSection';
import { ProfileStatsSection } from '../components/profile/ProfileStatsSection';
import { ProfileAchievementsSection } from '../components/profile/ProfileAchievementsSection';

function ProfileErrorState({ title, message, onBack }: { title: string; message: string; onBack: () => void }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-950 text-white">
      <div className="max-w-md space-y-6 px-4 text-center">
        <div className="text-6xl text-slate-700">
          <Icon name="user-slash" />
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-slate-400">{message}</p>
        <button
          type="button"
          onClick={onBack}
          className="bg-app-accent-strong hover:bg-app-ring cursor-pointer rounded-lg px-6 py-2 font-medium transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export const PerfilPublico = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const router = useRouter();
  const {
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
    exists,
  } = useUserProfile(userId || undefined);

  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  if (!userId) {
    return (
      <ProfileErrorState
        title="Enlace inválido"
        message="Debes proporcionar un ID de usuario en la URL."
        onBack={() => router.push('/')}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950">
        <div className="space-y-4 text-center">
          <div className="text-app-accent animate-spin text-4xl">
            <Icon name="spinner" />
          </div>
          <p className="text-lg text-slate-300">Cargando perfil público...</p>
        </div>
      </div>
    );
  }

  if (!exists) {
    return (
      <ProfileErrorState
        title="Usuario no encontrado"
        message="El perfil que buscas no existe o ha sido eliminado."
        onBack={() => router.push('/')}
      />
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReport = () => {
    if (window.confirm(`¿Deseas reportar al usuario ${name}?`)) {
      setReported(true);
      setTimeout(() => setReported(false), 3000);
    }
  };

  return (
    <ProfilePageLayout glowVariant="public">
      <ProfileHeroCard
        photoUrl={photoUrl}
        name={name}
        personalPhrase={personalPhrase}
        createdAt={createdAt}
        level={level}
        totalXP={totalXP}
        levelInfo={levelInfo}
        accent="purple"
        headerActions={
          <>
            <button
              type="button"
              onClick={handleShare}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg bg-slate-800 p-2 text-sm font-medium',
                'text-app-accent transition-colors hover:bg-slate-700'
              )}
              title="Copiar enlace"
            >
              <Icon name={copied ? 'check' : 'share-nodes'} />
              <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Compartir'}</span>
            </button>
            <button
              type="button"
              onClick={handleReport}
              className={cn(
                'cursor-pointer rounded-lg bg-slate-800 p-2 transition-colors hover:bg-red-900/30',
                reported ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
              )}
              title="Reportar usuario"
            >
              <Icon name="flag" />
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
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
    </ProfilePageLayout>
  );
};
