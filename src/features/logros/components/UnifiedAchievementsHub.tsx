import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faStar,
  faFire,
  faRing,
  faGem,
  faMedal,
  faAward,
  faZap,
  faCrown,
  faBullseye,
  faLock,
  faCheckCircle,
  faChartLine,
  faCalendar,
  faTasks,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';

/**
 * Centro Unificado de Logros y Gamificación
 * Integra badges, niveles, estadísticas y desafíos en una experiencia cohesiva
 */
export const UnifiedAchievementsHub = ({ 
  badges = [], 
  level = 1, 
  totalXP = 0, 
  xpForNextLevel = 1000,
  currentStreak = 0,
  maxStreak = 0,
  totalHours = 0,
  completedChallenges = 0,
  loading = false 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Cálculos de progreso
  const levelProgress = useMemo(() => {
    const baseXpPerLevel = 1000;
    const xpForCurrentLevel = (level - 1) * baseXpPerLevel;
    const xpForNextLevelStart = level * baseXpPerLevel;
    const currentLevelXP = totalXP - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevelStart - xpForCurrentLevel;
    return {
      current: currentLevelXP,
      needed: xpNeededForLevel,
      percentage: Math.round((currentLevelXP / xpNeededForLevel) * 100)
    };
  }, [level, totalXP]);

  // Categorías de badges
  const badgeCategories = useMemo(() => {
    return {
      all: 'Todos',
      common: 'Comunes',
      rare: 'Raros',
      epic: 'Épicos',
      legendary: 'Legendarios'
    };
  }, []);

  // Rareza de badges
  const rarityConfig = {
    común: { color: 'from-gray-600 to-gray-400', textColor: 'text-gray-300', badge: 'border-gray-500' },
    raro: { color: 'from-blue-600 to-blue-400', textColor: 'text-blue-300', badge: 'border-blue-500' },
    épico: { color: 'from-purple-600 to-purple-400', textColor: 'text-purple-300', badge: 'border-purple-500' },
    legendario: { color: 'from-yellow-600 to-yellow-400', textColor: 'text-yellow-300', badge: 'border-yellow-500' }
  };

  // Datos de estadísticas
  const stats = [
    {
      label: 'Nivel Actual',
      value: level,
      icon: faCrown,
      color: 'from-amber-600 to-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30'
    },
    {
      label: 'Racha Actual',
      value: `${currentStreak} días`,
      icon: faArrowUp,
      color: 'from-red-600 to-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    {
      label: 'Mejora Récord',
      value: `${maxStreak} días`,
      icon: faArrowUp,
      color: 'from-green-600 to-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      label: 'Horas Estudiadas',
      value: totalHours,
      icon: faChartLine,
      color: 'from-cyan-600 to-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-dvh bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-4xl text-cyan-400">
            <FontAwesomeIcon icon={faTasks} />
          </div>
          <p className="text-slate-300 text-lg">Cargando tus logros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl border border-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 p-8 md:p-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <FontAwesomeIcon icon={faTrophy} className="text-4xl text-amber-400" />
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400">
                Centro de Logros
              </h1>
            </div>
            <p className="text-slate-300 text-lg md:text-xl mb-6">
              Trackea tu progreso, gana insignias y domina el aprendizaje
            </p>

            {/* XP Progress Bar */}
            <div className="space-y-3 bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faZap} className="text-yellow-400 text-lg" />
                  <span className="text-white font-semibold">Experiencia</span>
                </div>
                <span className="text-cyan-400 font-bold text-lg">
                  {levelProgress.current} / {levelProgress.needed} XP
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-linear-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${levelProgress.percentage}%` }}
                />
              </div>
              <div className="text-right text-sm text-slate-400">
                {levelProgress.percentage}% completo → Siguiente nivel: {totalXP + (levelProgress.needed - levelProgress.current)} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`relative group rounded-xl border ${stat.borderColor} ${stat.bgColor} backdrop-blur-md p-6 hover:border-opacity-100 transition-all duration-300 overflow-hidden`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-linear-to-r ${stat.color} transition-opacity`}></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`text-3xl text-transparent bg-clip-text bg-linear-to-r ${stat.color}`}>
                  <FontAwesomeIcon icon={stat.icon} />
                </div>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 bg-slate-900/50 backdrop-blur-md p-3 rounded-xl border border-slate-700 overflow-x-auto">
        {[
          { id: 'overview', label: 'Resumen', icon: faChartLine },
          { id: 'badges', label: 'Insignias', icon: faMedal },
          { id: 'levels', label: 'Niveles', icon: faAward },
          { id: 'challenges', label: 'Desafíos', icon: faBullseye },
          { id: 'statistics', label: 'Estadísticas', icon: faTasks }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FontAwesomeIcon icon={tab.icon} className="text-sm" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT SECTIONS */}

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Achievements */}
          <div className="rounded-xl border border-slate-700 bg-linear-to-b from-slate-900/50 to-slate-950/50 backdrop-blur-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon icon={faTasks} className="text-2xl text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Logros Recientes</h2>
            </div>

            {badges && badges.slice(0, 6).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {badges.slice(0, 6).map((badge, idx) => (
                  <div
                    key={badge.id || idx}
                    className="group cursor-pointer"
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <div className="relative rounded-lg overflow-hidden bg-slate-800 border border-slate-700 p-4 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
                      <div className="aspect-square flex items-center justify-center text-4xl">
                        {badge.icon ? (
                          <FontAwesomeIcon icon={badge.icon} className="text-amber-400" />
                        ) : (
                          <FontAwesomeIcon icon={faTrophy} className="text-amber-400" />
                        )}
                      </div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity rounded-lg flex items-center justify-center">
                        <p className="text-white text-center text-xs font-bold px-2">{badge.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faLock} className="text-4xl text-slate-600 mb-3" />
                <p className="text-slate-400">Aún no has desbloqueado logros. ¡Comienza a estudiar!</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Next Milestone */}
            <div className="rounded-xl border border-blue-500/30 bg-linear-to-br from-blue-900/20 to-blue-950/20 backdrop-blur-md p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faTasks} className="text-2xl text-blue-400" />
                <h3 className="text-xl font-bold text-white">Próximo Hito</h3>
              </div>
              <div className="space-y-4">
                <p className="text-slate-300">Nivel {level + 1}: Maestría Avanzada</p>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${levelProgress.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400">Requiere {levelProgress.needed - levelProgress.current} XP más</p>
              </div>
            </div>

            {/* Achievements Unlocked */}
            <div className="rounded-xl border border-green-500/30 bg-linear-to-br from-green-900/20 to-green-950/20 backdrop-blur-md p-8">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-400" />
                <h3 className="text-xl font-bold text-white">Logros Desbloqueados</h3>
              </div>
              <div className="space-y-4">
                <p className="text-3xl font-bold text-green-400">{badges?.length || 0}</p>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-green-500 to-emerald-500"
                    style={{ width: '60%' }}
                  />
                </div>
                <p className="text-sm text-slate-400">60% de todos los logros disponibles</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BADGES TAB */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(badgeCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilterCategory(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filterCategory === key
                    ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges && badges.length > 0 ? (
              badges.map((badge, idx) => {
                const rarity = badge.rarity || 'común';
                const config = rarityConfig[rarity] || rarityConfig.común;

                return (
                  <div
                    key={badge.id || idx}
                    className="group cursor-pointer"
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <div className={`relative rounded-xl border ${config.badge} bg-linear-to-br ${config.color} p-6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-${rarity}-500/30 ${
                      badge.unlocked ? 'opacity-100' : 'opacity-50'
                    }`}>
                      {/* Background glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity"></div>

                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                        {/* Icon */}
                        <div className={`text-5xl ${config.textColor}`}>
                          {badge.icon ? (
                            <FontAwesomeIcon icon={badge.icon} />
                          ) : (
                            <FontAwesomeIcon icon={faTrophy} />
                          )}
                        </div>

                        {/* Name */}
                        <h3 className="font-bold text-white text-sm md:text-base">{badge.name}</h3>

                        {/* Rarity Badge */}
                        <span className="inline-block text-xs font-bold uppercase px-2 py-1 rounded-full bg-black/30 text-white">
                          {rarity}
                        </span>

                        {/* Status */}
                        {badge.unlocked ? (
                          <div className="flex items-center gap-1 text-green-300 text-xs">
                            <FontAwesomeIcon icon={faCheckCircle} />
                            Desbloqueado
                          </div>
                        ) : badge.progress ? (
                          <div className="w-full space-y-1">
                            <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-yellow-500"
                                style={{ width: `${(badge.progress / badge.totalProgress) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-slate-300">
                              {badge.progress}/{badge.totalProgress}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-300 text-xs">
                            <FontAwesomeIcon icon={faLock} />
                            Bloqueado
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <FontAwesomeIcon icon={faLock} className="text-4xl text-slate-600 mb-3" />
                <p className="text-slate-400">No hay insignias disponibles en esta categoría</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEVELS TAB */}
      {activeTab === 'levels' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-700 bg-linear-to-b from-slate-900/50 to-slate-950/50 backdrop-blur-md p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Progresión de Niveles</h2>

            <div className="space-y-6">
              {[1, 2, 3].map((lv) => {
                const isCurrentLevel = lv === level;
                const isCompleted = lv < level;

                return (
                  <div key={lv} className={`rounded-lg border ${
                    isCurrentLevel
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : isCompleted
                      ? 'border-green-500/30 bg-green-500/10'
                      : 'border-slate-700 bg-slate-800/50'
                  } p-6 transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`text-3xl font-bold w-16 h-16 rounded-lg flex items-center justify-center ${
                          isCurrentLevel
                            ? 'bg-linear-to-br from-cyan-500 to-blue-500 text-white'
                            : isCompleted
                            ? 'bg-linear-to-br from-green-500 to-emerald-500 text-white'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {lv}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {['Aprendiz', 'Intermedio', 'Avanzado'][lv - 1]}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {(lv - 1) * 1000} - {lv * 1000} XP
                          </p>
                        </div>
                      </div>
                      {isCurrentLevel && (
                        <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-sm font-semibold">
                          Actual
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 text-sm font-semibold flex items-center gap-2">
                          <FontAwesomeIcon icon={faCheckCircle} />
                          Completado
                        </span>
                      )}
                    </div>

                    {isCurrentLevel && (
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                        <div
                          className="h-full bg-linear-to-r from-cyan-500 to-blue-500"
                          style={{ width: `${levelProgress.percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CHALLENGES TAB */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-700 bg-linear-to-b from-slate-900/50 to-slate-950/50 backdrop-blur-md p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Desafíos Diarios</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: '5 Preguntas Correctas', reward: '50 XP', completed: true },
                { title: 'Racha de 3 Días', reward: '100 XP', completed: false },
                { title: 'Examen Simulado 80%+', reward: '200 XP', completed: false }
              ].map((challenge, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg border p-6 transition-all duration-300 ${
                    challenge.completed
                      ? 'border-green-500/30 bg-green-500/10'
                      : 'border-blue-500/30 bg-blue-500/10 hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white mb-1">{challenge.title}</h3>
                      <p className="text-sm text-slate-400">Recompensa: {challenge.reward}</p>
                    </div>
                    {challenge.completed ? (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-400" />
                    ) : (
                      <FontAwesomeIcon icon={faCalendar} className="text-2xl text-blue-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATISTICS TAB */}
      {activeTab === 'statistics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-700 bg-linear-to-b from-slate-900/50 to-slate-950/50 backdrop-blur-md p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} />
                Estadísticas Generales
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-slate-400">Logros Totales</span>
                  <span className="font-bold text-white">{badges?.length || 0}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-slate-400">Nivel Alcanzado</span>
                  <span className="font-bold text-white">{level}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-slate-400">Experiencia Total</span>
                  <span className="font-bold text-white">{totalXP.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-400">Desafíos Completados</span>
                  <span className="font-bold text-white">{completedChallenges}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-linear-to-b from-slate-900/50 to-slate-950/50 backdrop-blur-md p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faFire} />
                Actividad
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-slate-400">Racha Actual</span>
                  <span className="font-bold text-orange-400">{currentStreak} días</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-slate-400">Racha Máxima</span>
                  <span className="font-bold text-yellow-400">{maxStreak} días</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-700">
                  <span className="text-slate-400">Horas Estudiadas</span>
                  <span className="font-bold text-cyan-400">{totalHours.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-400">Preguntas Contestadas</span>
                  <span className="font-bold text-purple-400">1,250+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - Badge Detail */}
      {selectedBadge && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-4">
              <div className="text-6xl">
                <FontAwesomeIcon icon={selectedBadge.icon || faTrophy} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedBadge.name}</h2>
                <p className="text-sm text-slate-400 uppercase mt-1">{selectedBadge.rarity}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
              <p className="text-slate-300">{selectedBadge.description}</p>
              {selectedBadge.requirement && (
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Requisito:</p>
                  <p className="text-slate-300">{selectedBadge.requirement}</p>
                </div>
              )}
            </div>

            {selectedBadge.unlocked && selectedBadge.unlockedDate && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <p className="text-sm text-green-400">
                  ✓ Desbloqueado el {selectedBadge.unlockedDate}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedAchievementsHub;
