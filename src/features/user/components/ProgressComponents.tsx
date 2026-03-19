import { Icon } from '@/shared/components/Icon';

export const ProgressOverviewCard = ({ label, value, color, borderColor, shadowColor, info }) => (
  <div className={`p-8 bg-white/5 backdrop-blur-xl border ${borderColor} hover:border-opacity-100 hover:bg-opacity-20 rounded-2xl transition-all duration-300 hover:shadow-lg ${shadowColor} hover:scale-105`}>
    <p className={`${color} text-sm font-semibold mb-4 uppercase tracking-wider`}>{label}</p>
    <h3 className={`text-5xl font-black bg-linear-to-r ${color} bg-clip-text text-transparent mb-4`}>{value}</h3>
    {info && (
      <>
        <div className="mb-4 bg-slate-800/50 rounded-full h-2 overflow-hidden border border-slate-700/30">
          <div className={`bg-linear-to-r ${color} h-full`} style={{ width: `${value}%` }}></div>
        </div>
        <p className="text-slate-300 text-sm">{info}</p>
      </>
    )}
  </div>
);

export const AreaPerformanceCard = ({ area }) => (
  <div className="p-8 bg-white/5 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Icon name={area.icon} className="text-3xl text-cyan-400" />
        <div>
          <h4 className="text-xl font-semibold text-white">{area.name}</h4>
          <p className="text-3xl font-black bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mt-2">{area.percentage}%</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-slate-400 text-sm font-semibold mb-2">Respuestas</p>
        <p className="text-2xl font-black text-cyan-400">{area.correct}/{area.total}</p>
      </div>
    </div>
    <div className="bg-slate-800/50 rounded-full h-2 overflow-hidden border border-cyan-500/30">
      <div
        className={`bg-linear-to-r ${area.color} h-full transition-all duration-500`}
        style={{ width: `${area.percentage}%` }}
      ></div>
    </div>
  </div>
);

export const RecommendationsList = ({ recommendations, icons, iconColors }) => (
  <div className="bg-linear-to-br from-orange-600/20 via-red-600/20 to-pink-600/20 rounded-3xl p-12 shadow-2xl border-2 border-orange-500/30 backdrop-blur-xl hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
    <h3 className="text-2xl font-black mb-8 bg-linear-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
      🎯 Recomendaciones Personalizadas
    </h3>
    <ul className="space-y-4">
      {recommendations.map((recommendation, idx) => (
        <li key={idx} className="flex gap-4 items-start">
          <Icon 
            name={icons[idx % icons.length]} 
            className={`${iconColors[idx % iconColors.length]} text-xl shrink-0 mt-1`} 
          />
          <span className="text-slate-200 font-semibold text-lg">{recommendation}</span>
        </li>
      ))}
    </ul>
  </div>
);
