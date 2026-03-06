import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faStar, 
  faCalendarAlt, 
  faFlag, 
  faBookOpen,
  faChartLine,
  faSpinner,
  faShareNodes,
  faCheck,
  faUserSlash
} from '@fortawesome/free-solid-svg-icons';
import { useUserProfile } from '../hooks/useUserProfile';

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
    exists
  } = useUserProfile(userId || undefined);

  const [copied, setCopied] = useState(false);

  if (!userId) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-6 max-w-md px-4">
          <div className="text-6xl text-slate-700">
            <FontAwesomeIcon icon={faUserSlash} />
          </div>
          <h2 className="text-2xl font-bold">Enlace inválido</h2>
          <p className="text-slate-400">
            Debes proporcionar un ID de usuario en la URL.
          </p>
          <button
            onClick={() => router.push('/')}
            className="cursor-pointer px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors font-medium"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }
  const [reported, setReported] = useState(false);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReport = () => {
    // Aquí iría la lógica real de reporte (ej: abrir modal o enviar a Firestore)
    if (window.confirm(`¿Deseas reportar al usuario ${name}?`)) {
      setReported(true);
      // Simulación de reporte enviado
      setTimeout(() => setReported(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-4xl text-cyan-400">
            <FontAwesomeIcon icon={faSpinner} />
          </div>
          <p className="text-slate-300 text-lg">Cargando perfil público...</p>
        </div>
      </div>
    );
  }

  if (!exists) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-6 max-w-md px-4">
          <div className="text-6xl text-slate-700">
            <FontAwesomeIcon icon={faUserSlash} />
          </div>
          <h2 className="text-2xl font-bold">Usuario no encontrado</h2>
          <p className="text-slate-400">
            El perfil que buscas no existe o ha sido eliminado.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="cursor-pointer px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors font-medium"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white pb-24 md:pb-0">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header Profile Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 flex gap-2">
            <button 
              onClick={handleShare}
              className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors p-2 rounded-lg flex items-center gap-2 text-sm font-medium"
              title="Copiar enlace"
            >
              <FontAwesomeIcon icon={copied ? faCheck : faShareNodes} />
              <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Compartir'}</span>
            </button>
            <button 
              onClick={handleReport}
              className={`cursor-pointer bg-slate-800 hover:bg-red-900/30 transition-colors p-2 rounded-lg ${reported ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
              title="Reportar usuario"
            >
              <FontAwesomeIcon icon={faFlag} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-purple-500/30 p-1 bg-slate-950 shadow-lg shadow-purple-500/20">
                <img 
                  src={photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
                  alt={name}
                  className="w-full h-full rounded-full object-cover bg-slate-800"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700 rounded-full px-3 py-1 text-xs font-bold text-purple-400 shadow-lg">
                {levelInfo?.levelIcon} Nivel {levelInfo?.level || level}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{name}</h1>
              <p className="text-slate-400 italic text-lg">"{personalPhrase}"</p>
              
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-slate-500 pt-2">
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Miembro desde: {createdAt}
                </span>
              </div>

              {/* XP Bar */}
              <div className="max-w-md mt-4">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-purple-400 font-bold text-base" 
                      title={`XP Total: ${totalXP || 0}`}
                    >
                      {typeof totalXP === 'number' ? totalXP : 0}
                    </span>
                    <span className="text-slate-400">XP Total</span>
                    {false && (
                      <span className="text-xs text-red-400 ml-2">
                        ⚠️ Diferencia detectada
                      </span>
                    )}
                  </div>
                  {levelInfo?.xpForNextLevel !== null && levelInfo?.xpForNextLevel > 0 ? (
                    <span className="text-slate-500">
                      {levelInfo?.xpForNextLevel} XP para Nivel {(levelInfo?.level || level) + 1}
                    </span>
                  ) : (
                    <span className="text-yellow-400 font-semibold">Nivel Máximo</span>
                  )}
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                  <div 
                    className={`h-full bg-gradient-to-r ${levelInfo?.levelColor || 'from-purple-500 to-purple-600'} transition-all duration-1000 shadow-lg`}
                    style={{ width: `${levelInfo?.xpProgress || 0}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-semibold">Nivel {levelInfo?.level || level}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{levelInfo?.levelName || 'Aprendiz'}</span>
                    {levelInfo?.levelIcon && <span className="text-lg">{levelInfo?.levelIcon}</span>}
                  </div>
                  {levelInfo?.xpProgress !== null && (
                    <span className="text-slate-500">{Math.round(levelInfo?.xpProgress || 0)}%</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Courses */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Recent Activity / Stats */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <FontAwesomeIcon icon={faChartLine} className="text-green-400" />
                Estadísticas
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-white">{achievements.filter(a => a.status === 'completed').length}</div>
                  <div className="text-xs text-slate-400 uppercase mt-1">Logros</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-white">{level}</div>
                  <div className="text-xs text-slate-400 uppercase mt-1">Nivel</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-white">
                    {typeof totalXP === 'number' ? totalXP : 0}
                  </div>
                  <div className="text-xs text-slate-400 uppercase mt-1">XP Total</div>
                </div>
              </div>
            </div>

            {/* Courses Progress (Read Only) */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <FontAwesomeIcon icon={faBookOpen} className="text-purple-400" />
                Progreso en Cursos
              </h2>
              
              <div className="space-y-6">
                {Object.entries(coursesProgress).length > 0 ? (
                  Object.entries(coursesProgress).map(([courseId, progress]) => (
                    <div key={courseId} className="group">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-slate-200 capitalize">{courseId.replace('-', ' ')}</span>
                        <span className="text-purple-400 font-bold">{progress}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>Este usuario aún no ha iniciado cursos.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Achievements */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
                  Logros
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {achievements.slice(0, 9).map((achievement) => {
                  const isUnlocked = achievement.status === 'completed';
                  return (
                    <div 
                      key={achievement.id}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 border transition-all ${
                        isUnlocked 
                          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' 
                          : 'bg-slate-800/50 border-slate-700 text-slate-600 grayscale opacity-50'
                      }`}
                      title={achievement.title}
                    >
                      <FontAwesomeIcon icon={achievement.icon} className="text-2xl mb-1" />
                      {isUnlocked && <FontAwesomeIcon icon={faStar} className="text-[8px] text-yellow-200 absolute top-2 right-2" />}
                    </div>
                  );
                })}
              </div>
              
              {achievements.length === 0 && (
                <p className="text-center text-slate-500 text-sm py-4">
                  Sin logros desbloqueados aún.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
