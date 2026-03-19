import { useState, useMemo } from 'react';
import { Icon } from '@/shared/components/Icon';

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
  loading = false,
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
      percentage: Math.round((currentLevelXP / xpNeededForLevel) * 100),
    };
  }, [level, totalXP]);

  // Categorías de badges
  const badgeCategories = useMemo(() => {
    return {
      all: 'Todos',
      common: 'Comunes',
      rare: 'Raros',
      epic: 'Épicos',
      legendary: 'Legendarios',
    };
  }, []);

  // Rareza de badges
  const rarityConfig = {
    común: {
      color: 'from-gray-600 to-gray-400',
      textColor: 'text-gray-300',
      badge: 'border-gray-500',
    },
    raro: {
      color: 'from-blue-600 to-blue-400',
      textColor: 'text-blue-300',
      badge: 'border-blue-500',
    },
    épico: {
      color: 'from-purple-600 to-purple-400',
      textColor: 'text-purple-300',
      badge: 'border-purple-500',
    },
    legendario: {
      color: 'from-yellow-600 to-yellow-400',
      textColor: 'text-yellow-300',
      badge: 'border-yellow-500',
    },
  };

  // Datos de estadísticas
  const stats = [
    {
      label: 'Nivel Actual',
      value: level,
      icon: 'crown',
      color: 'from-amber-600 to-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
    {
      label: 'Racha Actual',
      value: `${currentStreak} días`,
      icon: 'arrow-up',
      color: 'from-red-600 to-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      label: 'Mejora Récord',
      value: `${maxStreak} días`,
      icon: 'arrow-up',
      color: 'from-green-600 to-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Horas Estudiadas',
      value: totalHours,
      icon: 'chart-line',
      color: 'from-cyan-600 to-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/30',
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="space-y-4 text-center">
          <div className="animate-spin text-4xl text-cyan-400">
            <Icon name="tasks" />
          </div>
          <p className="text-lg text-slate-300">Cargando tus logros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* HERO HEADER */}
      <div className="border-gradient-to-r relative overflow-hidden rounded-2xl border from-cyan-500/50 via-blue-500/50 to-purple-500/50">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-cyan-400 blur-3xl"></div>
          <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-purple-400 blur-3xl"></div>
        </div>

        <div className="relative z-10 p-8 md:p-12">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <Icon
                name="trophy"
                size="2xl"
                className="text-4xl text-amber-400"
              />
              <h1 className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent">
                Centro de Logros
              </h1>
            </div>
            <p className="mb-6 text-lg text-slate-300 md:text-xl">
              Trackea tu progreso, gana insignias y domina el aprendizaje
            </p>

            {/* XP Progress Bar */}
            <div className="space-y-3 rounded-xl border border-white/10 bg-black/30 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    name="zap"
                    size="lg"
                    className="text-lg text-yellow-400"
                  />
                  <span className="font-semibold text-white">Experiencia</span>
                </div>
                <span className="text-lg font-bold text-cyan-400">
                  {levelProgress.current} / {levelProgress.needed} XP
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                <div
                  className="h-full bg-linear-to-r from-yellow-500 via-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${levelProgress.percentage}%` }}
                />
              </div>
              <div className="text-right text-sm text-slate-400">
                {levelProgress.percentage}% completo → Siguiente nivel:{' '}
                {totalXP + (levelProgress.needed - levelProgress.current)} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`group relative rounded-xl border ${stat.borderColor} ${stat.bgColor} hover:border-opacity-100 overflow-hidden p-6 backdrop-blur-md transition-all duration-300`}
          >
            <div
              className={`absolute inset-0 bg-linear-to-r opacity-0 group-hover:opacity-10 ${stat.color} transition-opacity`}
            ></div>
            <div className="relative z-10">
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`bg-linear-to-r bg-clip-text text-3xl text-transparent ${stat.color}`}
                >
                  <Icon name={stat.icon} />
                </div>
              </div>
              <p className="mb-1 text-sm font-medium text-slate-400">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/50 p-3 backdrop-blur-md">
        {[
          { id: 'overview', label: 'Resumen', icon: 'chart-line' },
          { id: 'badges', label: 'Insignias', icon: 'medal' },
          { id: 'levels', label: 'Niveles', icon: 'award' },
          { id: 'challenges', label: 'Desafíos', icon: 'bullseye' },
          { id: 'statistics', label: 'Estadísticas', icon: 'tasks' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <Icon name={tab.icon} size="sm" className="text-sm" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT SECTIONS */}

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recent Achievements */}
          <div className="rounded-xl border border-slate-700 bg-linear-to-b from-slate-900/50 to-slate-950/50 p-8 backdrop-blur-md">
            <div className="mb-6 flex items-center gap-3">
              <Icon
                name="tasks"
                size="2xl"
                className="text-2xl text-cyan-400"
              />
              <h2 className="text-2xl font-bold text-white">
                Logros Recientes
              </h2>
            </div>

            {badges && badges.slice(0, 6).length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {badges.slice(0, 6).map((badge, idx) => (
                  <div
                    key={badge.id || idx}
                    className="group cursor-pointer"
                    onClick={() => setSelectedBadge(badge)}
                  >
                    <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800 p-4 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
                      <div className="flex aspect-square items-center justify-center text-4xl">
                        {badge.icon ? (
                          <Icon
                            name={
                              typeof badge.icon === 'string'
                                ? badge.icon
                                : 'trophy'
                            }
                            className="text-amber-400"
                          />
                        ) : (
                          <Icon name="trophy" className="text-amber-400" />
                        )}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="px-2 text-center text-xs font-bold text-white">
                          {badge.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Icon
                  name="lock"
                  size="2xl"
                  className="mb-3 text-4xl text-slate-600"
                />
                <p className="text-slate-400">
                  Aún no has desbloqueado logros. ¡Comienza a estudiar!
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Next Milestone */}
            <div className="rounded-xl border border-blue-500/30 bg-linear-to-br from-blue-900/20 to-blue-950/20 p-8 backdrop-blur-md">
              <div className="mb-4 flex items-center gap-3">
                <Icon
                  name="tasks"
                  size="2xl"
                  className="text-2xl text-blue-400"
                />
                <h3 className="text-xl font-bold text-white">Próximo Hito</h3>
              </div>
              <div className="space-y-4">
                <p className="text-slate-300">
                  Nivel {level + 1}: Maestría Avanzada
                </p>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${levelProgress.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-slate-400">
                  Requiere {levelProgress.needed - levelProgress.current} XP más
                </p>
              </div>
            </div>

            {/* Achievements Unlocked */}
            <div className="rounded-xl border border-green-500/30 bg-linear-to-br from-green-900/20 to-green-950/20 p-8 backdrop-blur-md">
              <div className="mb-4 flex items-center gap-3">
                <Icon
                  name="check-circle"
                  size="2xl"
                  className="text-2xl text-green-400"
                />
                <h3 className="text-xl font-bold text-white">
                  Logros Desbloqueados
                </h3>
              </div>
              <div className="space-y-4">
                <p className="text-3xl font-bold text-green-400">
                  {badges?.length || 0}
                </p>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-linear-to-r from-green-500 to-emerald-500"
                    style={{ width: '60%' }}
                  />
                </div>
                <p className="text-sm text-slate-400">
                  60% de todos los logros disponibles
                </p>
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
                className={`rounded-lg px-4 py-2 font-medium transition-all duration-300 ${
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                    <div
                      className={`relative rounded-xl border ${config.badge} bg-linear-to-br ${config.color} overflow-hidden p-6 transition-all duration-300 hover:shadow-lg hover:shadow-${rarity}-500/30 ${
                        badge.unlocked ? 'opacity-100' : 'opacity-50'
                      }`}
                    >
                      {/* Background glow */}
                      <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20"></div>

                      {/* Content */}
                      <div className="relative z-10 flex flex-col items-center space-y-3 text-center">
                        {/* Icon */}
                        <div className={`text-5xl ${config.textColor}`}>
                          {badge.icon ? (
                            <Icon
                              name={
                                typeof badge.icon === 'string'
                                  ? badge.icon
                                  : 'trophy'
                              }
                            />
                          ) : (
                            <Icon name="trophy" />
                          )}
                        </div>

                        {/* Name */}
                        <h3 className="text-sm font-bold text-white md:text-base">
                          {badge.name}
                        </h3>

                        {/* Rarity Badge */}
                        <span className="inline-block rounded-full bg-black/30 px-2 py-1 text-xs font-bold text-white uppercase">
                          {rarity}
                        </span>

                        {/* Status */}
                        {badge.unlocked ? (
                          <div className="flex items-center gap-1 text-xs text-green-300">
                            <Icon name="check-circle" />
                            Desbloqueado
                          </div>
                        ) : badge.progress ? (
                          <div className="w-full space-y-1">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-black/30">
                              <div
                                className="h-full bg-yellow-500"
                                style={{
                                  width: `${(badge.progress / badge.totalProgress) * 100}%`,
                                }}
                              />
                            </div>
                            <p className="text-xs text-slate-300">
                              {badge.progress}/{badge.totalProgress}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-red-300">
                            <Icon name="lock" />
                            Bloqueado
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center">
                <Icon
                  name="lock"
                  size="2xl"
                  className="mb-3 text-4xl text-slate-600"
                />
                <p className="text-slate-400">
                  No hay insignias disponibles en esta categoría
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LEVELS TAB */}
      {activeTab === 'levels' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-700 bg-linear-to-b from-slate-900/50 to-slate-950/50 p-8 backdrop-blur-md">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Progresión de Niveles
            </h2>

            <div className="space-y-6">
              {[1, 2, 3].map((lv) => {
                const isCurrentLevel = lv === level;
                const isCompleted = lv < level;

                return (
                  <div
                    key={lv}
                    className={`rounded-lg border ${
                      isCurrentLevel
                        ? 'border-cyan-500/50 bg-cyan-500/10'
                        : isCompleted
                          ? 'border-green-500/30 bg-green-500/10'
                          : 'border-slate-700 bg-slate-800/50'
                    } p-6 transition-all duration-300`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-lg text-3xl font-bold ${
                            isCurrentLevel
                              ? 'bg-linear-to-br from-cyan-500 to-blue-500 text-white'
                              : isCompleted
                                ? 'bg-linear-to-br from-green-500 to-emerald-500 text-white'
                                : 'bg-slate-700 text-slate-400'
                          }`}
                        >
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
                        <span className="inline-block rounded-full border border-cyan-500/50 bg-cyan-500/20 px-3 py-1 text-sm font-semibold text-cyan-400">
                          Actual
                        </span>
                      )}
                      {isCompleted && (
                        <span className="flex inline-block items-center gap-2 rounded-full border border-green-500/50 bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">
                          <Icon name="check-circle" />
                          Completado
                        </span>
                      )}
                    </div>

                    {isCurrentLevel && (
                      <div className="h-3 w-full overflow-hidden rounded-full border border-slate-700 bg-slate-800">
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
          <div className="rounded-xl border border-slate-700 bg-linear-to-b from-slate-900/50 to-slate-950/50 p-8 backdrop-blur-md">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Desafíos Diarios
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                {
                  title: '5 Preguntas Correctas',
                  reward: '50 XP',
                  completed: true,
                },
                {
                  title: 'Racha de 3 Días',
                  reward: '100 XP',
                  completed: false,
                },
                {
                  title: 'Examen Simulado 80%+',
                  reward: '200 XP',
                  completed: false,
                },
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
                      <h3 className="mb-1 font-bold text-white">
                        {challenge.title}
                      </h3>
                      <p className="text-sm text-slate-400">
                        Recompensa: {challenge.reward}
                      </p>
                    </div>
                    {challenge.completed ? (
                      <Icon
                        name="check-circle"
                        size="2xl"
                        className="text-2xl text-green-400"
                      />
                    ) : (
                      <Icon
                        name="calendar-alt"
                        size="2xl"
                        className="text-2xl text-blue-400"
                      />
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-700 bg-linear-to-b from-slate-900/50 to-slate-950/50 p-8 backdrop-blur-md">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                <Icon name="chart-line" />
                Estadísticas Generales
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-700 py-3">
                  <span className="text-slate-400">Logros Totales</span>
                  <span className="font-bold text-white">
                    {badges?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-700 py-3">
                  <span className="text-slate-400">Nivel Alcanzado</span>
                  <span className="font-bold text-white">{level}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 py-3">
                  <span className="text-slate-400">Experiencia Total</span>
                  <span className="font-bold text-white">
                    {totalXP.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-400">Desafíos Completados</span>
                  <span className="font-bold text-white">
                    {completedChallenges}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-linear-to-b from-slate-900/50 to-slate-950/50 p-8 backdrop-blur-md">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-white">
                <Icon name="fire" />
                Actividad
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-700 py-3">
                  <span className="text-slate-400">Racha Actual</span>
                  <span className="font-bold text-orange-400">
                    {currentStreak} días
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-700 py-3">
                  <span className="text-slate-400">Racha Máxima</span>
                  <span className="font-bold text-yellow-400">
                    {maxStreak} días
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-700 py-3">
                  <span className="text-slate-400">Horas Estudiadas</span>
                  <span className="font-bold text-cyan-400">
                    {totalHours.toLocaleString()}
                  </span>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="w-full max-w-md space-y-6 rounded-2xl border border-slate-700 bg-slate-900 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4 text-center">
              <div className="text-6xl">
                <Icon
                  name={
                    typeof selectedBadge?.icon === 'string'
                      ? selectedBadge.icon
                      : 'trophy'
                  }
                  className="text-amber-400"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedBadge.name}
                </h2>
                <p className="mt-1 text-sm text-slate-400 uppercase">
                  {selectedBadge.rarity}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-lg bg-slate-800/50 p-4">
              <p className="text-slate-300">{selectedBadge.description}</p>
              {selectedBadge.requirement && (
                <div className="border-t border-slate-700 pt-3">
                  <p className="mb-1 text-sm text-slate-400">Requisito:</p>
                  <p className="text-slate-300">{selectedBadge.requirement}</p>
                </div>
              )}
            </div>

            {selectedBadge.unlocked && selectedBadge.unlockedDate && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
                <p className="text-sm text-green-400">
                  ✓ Desbloqueado el {selectedBadge.unlockedDate}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 py-3 font-bold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/50"
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
