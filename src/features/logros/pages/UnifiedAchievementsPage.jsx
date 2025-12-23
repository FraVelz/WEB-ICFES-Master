import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGamificationFirestore } from '@/features/logros/hooks/useGamificationFirestore';
import { AchievementsList } from '../components/AchievementsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTrophy, faStar, faMedal } from '@fortawesome/free-solid-svg-icons';

export const UnifiedAchievementsPage = () => {
  const { user } = useAuth();
  const { 
    achievements, 
    loading, 
    totalXP, 
    level, 
    completedCount 
  } = useGamificationFirestore(user?.uid);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-4xl text-cyan-400">
            <FontAwesomeIcon icon={faSpinner} />
          </div>
          <p className="text-slate-300 text-lg">Cargando logros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white pb-24 md:pb-0">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xl">
              <FontAwesomeIcon icon={faTrophy} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Nivel Actual</p>
              <p className="text-2xl font-bold">{level}</p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl">
              <FontAwesomeIcon icon={faStar} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Experiencia Total</p>
              <p className="text-2xl font-bold">{totalXP} XP</p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xl">
              <FontAwesomeIcon icon={faMedal} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Logros Completados</p>
              <p className="text-2xl font-bold">{completedCount} / {achievements.length}</p>
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <AchievementsList achievements={achievements} />
      </div>
    </div>
  );
};
