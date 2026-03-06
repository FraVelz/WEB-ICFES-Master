import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export const QuickStatCard = ({ stat, value, icon, color }) => (
  <div 
    className={`bg-linear-to-br ${color} rounded-lg p-6 text-white shadow-lg border border-slate-700/50 hover:scale-105 transition-transform duration-300`}
  >
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-semibold opacity-90">{stat}</p>
      <FontAwesomeIcon icon={icon} className="text-xl opacity-70" />
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export const DailyGoalCard = ({ percentage, current, target }) => (
  <div className="bg-linear-to-r from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 mb-8">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
        🎯 Meta del Día
      </h3>
      <span className="text-2xl font-bold text-amber-400">{percentage}%</span>
    </div>
    <p className="text-slate-400 mb-4">{current} / {target} XP ganados</p>
    <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-3">
      <div
        className="h-full bg-linear-to-r from-amber-600 to-yellow-600 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
    <p className="text-sm text-slate-500">Te faltan {target - current} XP para completar hoy 🔥</p>
  </div>
);

export const ProgressBar = ({ percentage, label, info }) => (
  <div className="bg-linear-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{label}</h3>
        <p className="text-sm text-slate-400">{info}</p>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
          {percentage}%
        </div>
      </div>
    </div>
    <div className="h-4 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
      <div
        className="h-full bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

export const NavigationCard = ({ card }) => (
  <Link
    href={card.link}
    className="group relative bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
  >
    {card.badge && (
      <div className="absolute -top-2 -right-2 bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
        {card.badge}
      </div>
    )}
    
    <div className={`p-3 rounded-lg bg-linear-to-br ${card.color} text-white mb-3 inline-block group-hover:scale-110 transition-transform duration-300`}>
      <FontAwesomeIcon icon={card.icon} className="text-xl" />
    </div>
    
    <h3 className="font-bold text-white mb-1">{card.title}</h3>
    <p className="text-xs text-slate-400">{card.description}</p>
    
    <div className="flex items-center gap-2 mt-4 text-blue-400 group-hover:text-blue-300 transition-colors">
      <span className="text-xs font-semibold">Ir</span>
      <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

export const RecommendedSessionItem = ({ session }) => (
  <div className="flex items-center justify-between bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition-colors">
    <div>
      <p className="font-semibold text-white">{session.area}</p>
      <p className="text-sm text-slate-400">{session.nivel}</p>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-sm text-slate-400">{session.tiempo}</span>
      <span className="px-3 py-1 bg-yellow-600/30 text-yellow-300 rounded-full text-sm font-semibold">
        +{session.puntos} XP
      </span>
    </div>
  </div>
);
