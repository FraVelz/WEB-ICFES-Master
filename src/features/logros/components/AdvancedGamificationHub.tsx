import { useState } from 'react';
import { Icon } from '@/shared/components/Icon';
import { AppMascot } from '@/shared/components';

/**
 * Sistema mejorado de gamificación con badges, niveles y recompensas
 */
export const AdvancedGamificationHub = () => {
  const [activeTab, setActiveTab] = useState('badges');

  // Sistema de Niveles (1-100)
  const currentLevel = 15;
  const totalXP = 12500;
  const xpForNextLevel = 15000;
  const xpProgress =
    ((totalXP - (currentLevel - 1) * 1000) /
      (xpForNextLevel - (currentLevel - 1) * 1000)) *
    100;

  // Badges disponibles
  const badges = [
    {
      id: 'first-step',
      name: 'Primer Paso',
      icon: 'star',
      color: 'text-yellow-400',
      bgColor: 'from-yellow-600 to-yellow-400',
      description: 'Completa tu primera pregunta',
      unlocked: true,
      unlockedDate: '2024-11-15',
      rarity: 'común',
    },
    {
      id: 'fire-streak',
      name: 'Racha de Fuego',
      icon: 'fire',
      color: 'text-red-400',
      bgColor: 'from-red-600 to-orange-400',
      description: 'Mantén una racha de 10 días',
      unlocked: true,
      unlockedDate: '2024-11-20',
      rarity: 'rara',
    },
    {
      id: 'math-master',
      name: 'Maestro de Matemáticas',
      icon: 'zap',
      color: 'text-blue-400',
      bgColor: 'from-blue-600 to-cyan-400',
      description: 'Completa todos los niveles de Matemáticas',
      unlocked: false,
      progress: 4,
      totalProgress: 6,
      rarity: 'épica',
    },
    {
      id: 'perfect-score',
      name: 'Puntuación Perfecta',
      icon: 'bullseye',
      color: 'text-green-400',
      bgColor: 'from-green-600 to-emerald-400',
      description: '100% en un examen simulado',
      unlocked: false,
      progress: 85,
      totalProgress: 100,
      rarity: 'mítica',
    },
    {
      id: 'marathon',
      name: 'Maratonista',
      icon: 'zap',
      color: 'text-purple-400',
      bgColor: 'from-purple-600 to-pink-400',
      description: '100 horas de estudio',
      unlocked: true,
      unlockedDate: '2024-12-01',
      rarity: 'rara',
    },
    {
      id: 'social-scholar',
      name: 'Erudito Social',
      icon: 'medal',
      color: 'text-orange-400',
      bgColor: 'from-orange-600 to-yellow-400',
      description: 'Completa todos los niveles de Sociales',
      unlocked: false,
      progress: 2,
      totalProgress: 4,
      rarity: 'épica',
    },
    {
      id: 'reading-guru',
      name: 'Gurú de Lectura',
      icon: 'star',
      color: 'text-cyan-400',
      bgColor: 'from-cyan-600 to-blue-400',
      description: 'Completa todos los niveles de Lectura Crítica',
      unlocked: false,
      progress: 3,
      totalProgress: 4,
      rarity: 'épica',
    },
    {
      id: 'science-explorer',
      name: 'Explorador Científico',
      icon: 'zap',
      color: 'text-pink-400',
      bgColor: 'from-pink-600 to-purple-400',
      description: 'Completa todos los niveles de Ciencias Naturales',
      unlocked: false,
      progress: 2,
      totalProgress: 5,
      rarity: 'épica',
    },
    {
      id: 'ultimate-500',
      name: 'La Meta ICFES 500',
      icon: 'crown',
      color: 'text-yellow-300',
      bgColor: 'from-yellow-600 to-amber-400',
      description: 'Alcanza un puntaje de 500 en un examen simulado',
      unlocked: false,
      progress: 420,
      totalProgress: 500,
      rarity: 'mítica',
    },
  ];

  // Hitos de niveles
  const levelMilestones = [
    { level: 1, name: 'Aprendiz', color: 'text-gray-400' },
    { level: 10, name: 'Estudiante', color: 'text-green-400' },
    { level: 20, name: 'Erudito', color: 'text-blue-400' },
    { level: 30, name: 'Maestro', color: 'text-purple-400' },
    { level: 50, name: 'Sabio', color: 'text-yellow-400' },
    { level: 75, name: 'Leyenda', color: 'text-red-400' },
    { level: 100, name: 'ICFES Master', color: 'text-yellow-300' },
  ];

  const getRarityColor = (rarity) => {
    const rarityColors = {
      común: 'text-green-400 bg-green-900/30',
      rara: 'text-blue-400 bg-blue-900/30',
      épica: 'text-purple-400 bg-purple-900/30',
      mítica: 'text-yellow-300 bg-yellow-900/30',
    };
    return rarityColors[rarity] || 'text-slate-400 bg-slate-900/30';
  };

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const lockedBadges = badges.filter((b) => !b.unlocked);

  return (
    <div className="space-y-8">
      {/* Mascota de Bienvenida */}
      <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-cyan-500/30 bg-linear-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 p-8 lg:flex-row">
        <div className="flex-1">
          <h1 className="mb-3 text-4xl font-bold text-white">
            ¡Bienvenido a tu Centro de Gamificación!
          </h1>
          <p className="mb-4 text-lg text-slate-300">
            Aquí puedes ver todos tus logros, badges, niveles y recompensas.
            ¡Sigue estudiando para desbloquear nuevos premios y convertirte en
            una leyenda!
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="rounded-lg bg-slate-700/50 px-4 py-2">
              <span className="font-bold text-cyan-400">
                {' '}
                {unlockedBadges.length}
              </span>
              <span className="text-slate-300"> Badges</span>
            </div>
            <div className="rounded-lg bg-slate-700/50 px-4 py-2">
              <span className="font-bold text-purple-400">
                {' '}
                Nivel {currentLevel}
              </span>
            </div>
            <div className="rounded-lg bg-slate-700/50 px-4 py-2">
              <span className="font-bold text-yellow-400">
                {' '}
                {totalXP.toLocaleString('es-CO')}
              </span>
              <span className="text-slate-300"> XP</span>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <AppMascot
            size="lg"
            emotion="celebrating"
            context="achievement"
            interactive={true}
          />
        </div>
      </div>

      {/* Sistema de Niveles */}
      <div className="rounded-2xl border border-slate-700 bg-linear-to-r from-slate-800 to-slate-900 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-white">
              Nivel {currentLevel}
            </h2>
            <p className="text-slate-400">
              Camino hacia ICFES Master (Nivel 100)
            </p>
          </div>
          <div className="text-right">
            <div className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent">
              {totalXP.toLocaleString('es-CO')}
            </div>
            <p className="text-sm text-slate-400">XP Total</p>
          </div>
        </div>

        {/* Progress Bar Nivel Actual */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-slate-400">
            <span>Progreso al Nivel {currentLevel + 1}</span>
            <span>{Math.round(xpProgress)}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full border border-slate-600 bg-slate-700">
            <div
              className="h-full bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {xpForNextLevel - totalXP} XP hasta el próximo nivel
          </p>
        </div>

        {/* Hitos de Niveles */}
        <div>
          <h3 className="mb-4 text-sm font-bold text-white">Tu Progresión</h3>
          <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
            {levelMilestones.map((milestone) => {
              const isReached = currentLevel >= milestone.level;
              return (
                <div
                  key={milestone.level}
                  className={`rounded-lg border p-3 text-center transition-all duration-300 ${
                    isReached
                      ? `border-slate-600 bg-slate-700/50`
                      : 'border-slate-700 bg-slate-800/30'
                  }`}
                >
                  <div
                    className={`mb-1 text-xs font-bold ${isReached ? 'text-white' : 'text-slate-500'}`}
                  >
                    {milestone.level}
                  </div>
                  <p className={`truncate text-xs ${milestone.color}`}>
                    {milestone.name}
                  </p>
                  {isReached && (
                    <Icon
                      name="check-circle"
                      className="mt-1 text-sm text-green-400"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        {[
          { id: 'badges', label: 'Badges', icon: 'trophy' },
          { id: 'rewards', label: 'Recompensas', icon: 'gem' },
          { id: 'achievements', label: 'Logros', icon: 'medal' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'border-b-blue-600 text-white'
                : 'border-b-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <Icon name={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido del Tab */}
      {activeTab === 'badges' && (
        <div className="space-y-8">
          {/* Badges Desbloqueados */}
          {unlockedBadges.length > 0 && (
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                <Icon name="check-circle" className="text-green-400" />
                Desbloqueados ({unlockedBadges.length})
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {unlockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="group relative rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-center transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
                  >
                    <div
                      className={`inline-block rounded-lg bg-linear-to-br p-4 ${badge.bgColor} mb-3 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon name={badge.icon} className="text-3xl text-white" />
                    </div>
                    <h4 className="mb-1 font-bold text-white">{badge.name}</h4>
                    <p className="mb-3 text-xs text-slate-400">
                      {badge.description}
                    </p>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getRarityColor(badge.rarity)}`}
                    >
                      {badge.rarity.charAt(0).toUpperCase() +
                        badge.rarity.slice(1)}
                    </span>
                    <p className="mt-3 border-t border-slate-700 pt-3 text-xs text-slate-500">
                      Desbloqueado:{' '}
                      {new Date(badge.unlockedDate).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Badges por Desbloquear */}
          {lockedBadges.length > 0 && (
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                <Icon name="lock" className="text-slate-400" />
                Por Desbloquear ({lockedBadges.length})
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {lockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="relative rounded-lg border border-slate-700 bg-slate-800/30 p-6 text-center opacity-60 transition-all duration-300 hover:opacity-100"
                  >
                    <div
                      className={`inline-block rounded-lg bg-linear-to-br p-4 ${badge.bgColor} mb-3 opacity-40`}
                    >
                      <Icon name={badge.icon} className="text-3xl text-white" />
                    </div>
                    <h4 className="mb-1 font-bold text-white">{badge.name}</h4>
                    <p className="mb-3 text-xs text-slate-400">
                      {badge.description}
                    </p>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${getRarityColor(badge.rarity)}`}
                    >
                      {badge.rarity.charAt(0).toUpperCase() +
                        badge.rarity.slice(1)}
                    </span>
                    {badge.progress && (
                      <div className="mt-3 border-t border-slate-700 pt-3">
                        <div className="mb-1 h-2 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className="h-full bg-linear-to-r from-blue-600 to-purple-600"
                            style={{
                              width: `${(badge.progress / badge.totalProgress) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-500">
                          {badge.progress}/{badge.totalProgress}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              icon: 'gem',
              title: 'Gemas',
              color: 'from-pink-600 to-purple-600',
              current: 2450,
              description: 'Desbloquea contenido premium',
            },
            {
              icon: 'zap',
              title: 'XP Especial',
              color: 'from-yellow-600 to-orange-600',
              current: 500,
              description: 'Puntos bonus por desafíos',
            },
            {
              icon: 'star',
              title: 'Estrellas',
              color: 'from-blue-600 to-cyan-600',
              current: 28,
              description: 'Cambia por items exclusivos',
            },
            {
              icon: 'trophy',
              title: 'Trofeos',
              color: 'from-amber-600 to-yellow-600',
              current: 12,
              description: 'Logros especiales completados',
            },
          ].map((reward, idx) => (
            <div
              key={idx}
              className={`bg-linear-to-br ${reward.color}/20 border-gradient-to-br border ${reward.color} rounded-lg p-6`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="mb-1 text-lg font-bold text-white">
                    {reward.title}
                  </h3>
                  <p className="text-sm text-slate-400">{reward.description}</p>
                </div>
                <Icon
                  name={typeof reward.icon === 'string' ? reward.icon : 'star'}
                  className="text-3xl opacity-60"
                />
              </div>
              <div className="text-3xl font-bold text-white">
                {reward.current.toLocaleString('es-CO')}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-4">
          {[
            {
              title: ' Racha de Fuego',
              description: 'Estudia 12 días consecutivos sin fallar',
              progress: 12,
              total: 12,
              completed: true,
            },
            {
              title: ' Estudiante Dedicado',
              description: 'Completa 50 horas de estudio',
              progress: 48,
              total: 50,
              completed: false,
            },
            {
              title: ' Precisión Perfecta',
              description: 'Alcanza 90% de precisión en una sesión',
              progress: 85,
              total: 100,
              completed: false,
            },
            {
              title: ' Conquistador',
              description: 'Completa todos los niveles de una materia',
              progress: 4,
              total: 4,
              completed: true,
            },
          ].map((achievement, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-6 transition-all duration-300 ${
                achievement.completed
                  ? 'border-green-600 bg-linear-to-r from-green-900/30 to-emerald-900/30'
                  : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-lg font-bold text-white">
                  {achievement.title}
                </h3>
                {achievement.completed && (
                  <Icon
                    name="check-circle"
                    className="text-xl text-green-400"
                  />
                )}
              </div>
              <p className="mb-3 text-sm text-slate-400">
                {achievement.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Progreso</span>
                  <span>
                    {achievement.progress}/{achievement.total}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className={`h-full bg-linear-to-r ${
                      achievement.completed
                        ? 'from-green-600 to-emerald-600'
                        : 'from-blue-600 to-purple-600'
                    }`}
                    style={{
                      width: `${(achievement.progress / achievement.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
