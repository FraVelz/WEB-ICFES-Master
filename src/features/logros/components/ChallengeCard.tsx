import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClock, faCoins, faBolt, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

export const ChallengeCard = ({ challenge, onComplete }) => {
  const router = useRouter();
  const isCompleted = challenge.status === 'completed';
  
  // Mapeo de áreas a rutas de práctica
  const getRoute = (area) => {
    if (area === 'matematicas') return '/practica/matematicas';
    if (area === 'lectura-critica') return '/practica/lectura-critica';
    if (area === 'ciencias-naturales') return '/practica/ciencias-naturales';
    if (area === 'sociales') return '/practica/sociales';
    return '/examen-completo'; // Default
  };

  const handleStart = () => {
    if (isCompleted) return;
    
    // En un caso real, aquí navegaríamos a la práctica y pasaríamos el ID del desafío
    // Para esta demo, simulamos completar el desafío al hacer click (o navegar)
    // navigate(getRoute(challenge.area));
    
    // SIMULACIÓN: Completar directamente para probar la UI
    if (window.confirm("¿Simular completar este desafío? (En producción esto iría a la lección)")) {
      onComplete(challenge.id);
    } else {
      router.push(getRoute(challenge.area));
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
      isCompleted 
        ? 'bg-slate-900/40 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
        : 'bg-slate-800/40 border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/60'
    }`}>
      {/* Background Progress Bar (Visual effect) */}
      {!isCompleted && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-cyan-500/50 transition-all duration-500" 
          style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
        />
      )}

      <div className="p-5 flex items-start gap-4">
        {/* Icon Box */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
          isCompleted 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-slate-700/50 text-cyan-400'
        }`}>
          <FontAwesomeIcon icon={challenge.icon || faBolt} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className={`font-bold text-lg truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
              {challenge.title}
            </h3>
            {isCompleted && (
              <span className="text-green-400 text-sm flex items-center gap-1">
                <FontAwesomeIcon icon={faCheckCircle} />
                Hecho
              </span>
            )}
          </div>
          
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">
            {challenge.description}
          </p>

          {/* Rewards & Action */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-3 text-xs font-bold uppercase tracking-wider">
              <span className={`flex items-center gap-1 ${isCompleted ? 'text-slate-500' : 'text-yellow-400'}`}>
                <FontAwesomeIcon icon={faBolt} /> +{challenge.xpReward} XP
              </span>
              <span className={`flex items-center gap-1 ${isCompleted ? 'text-slate-500' : 'text-amber-400'}`}>
                <FontAwesomeIcon icon={faCoins} /> +{challenge.coinsReward}
              </span>
            </div>

            {!isCompleted && (
              <button 
                onClick={handleStart}
                className="px-4 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                Comenzar <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
