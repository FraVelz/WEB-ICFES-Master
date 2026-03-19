import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import { ACHIEVEMENT_CATEGORIES } from '../constants/achievements';

export const AchievementsList = ({ achievements = [] }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
      case 'in_progress': return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10';
      default: return 'text-slate-500 border-slate-700 bg-slate-800/50';
    }
  };

  const getProgressBarColor = (status) => {
    if (status === 'completed') return 'bg-yellow-400';
    if (status === 'incomplete') return 'bg-slate-600';
    return 'bg-cyan-400';
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Header & Filters */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent px-1">
          Logros y Metas
        </h2>
        
        {/* Scrollable Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, { label, icon }]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${
                activeCategory === key
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <FontAwesomeIcon icon={icon} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => {
          const isCompleted = achievement.status === 'completed';
          const isIncomplete = achievement.status === 'incomplete';
          const percent = Math.min(100, Math.max(0, (achievement.progress / achievement.target) * 100));

          return (
            <div 
              key={achievement.id}
              className={`relative group overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
                isCompleted 
                  ? 'bg-linear-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/30 hover:border-yellow-500/50' 
                  : isIncomplete
                    ? 'bg-slate-900/50 border-slate-800 opacity-75'
                    : 'bg-slate-800/30 border-slate-700 hover:border-cyan-500/30 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon Box */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl border ${getStatusColor(achievement.status)}`}>
                  <FontAwesomeIcon icon={achievement.icon} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold truncate pr-2 ${isCompleted ? 'text-yellow-100' : 'text-white'}`}>
                      {achievement.title}
                    </h3>
                    {isCompleted && (
                      <FontAwesomeIcon icon={faCheck} className="text-yellow-400 text-sm" />
                    )}
                    {isIncomplete && (
                      <FontAwesomeIcon icon={faLock} className="text-slate-600 text-sm" />
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className={isCompleted ? 'text-yellow-500/80' : 'text-cyan-500/80'}>
                        {isCompleted ? '¡Completado!' : `${achievement.progress} / ${achievement.target}`}
                      </span>
                      <span className="text-slate-500">
                        +${achievement.xpReward} XP
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(achievement.status)}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
