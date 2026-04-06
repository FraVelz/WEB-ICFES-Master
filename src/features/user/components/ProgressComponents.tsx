import { Icon } from '@/shared/components/Icon';

export const ProgressOverviewCard = ({
  label,
  value,
  color,
  borderColor,
  shadowColor,
  info,
}: {
  label: string;
  value: string | number;
  color: string;
  borderColor: string;
  shadowColor: string;
  info?: string;
}) => (
  <div
    className={`border bg-white/5 p-8 backdrop-blur-xl ${borderColor} hover:border-opacity-100 hover:bg-opacity-20 rounded-2xl transition-all duration-300 hover:shadow-lg ${shadowColor} hover:scale-105`}
  >
    <p className={`${color} mb-4 text-sm font-semibold tracking-wider uppercase`}>{label}</p>
    <h3 className={`bg-linear-to-r text-5xl font-black ${color} mb-4 bg-clip-text text-transparent`}>{value}</h3>
    {info && (
      <>
        <div className="mb-4 h-2 overflow-hidden rounded-full border border-slate-700/30 bg-slate-800/50">
          <div className={`bg-linear-to-r ${color} h-full`} style={{ width: `${value}%` }}></div>
        </div>
        <p className="text-sm text-slate-300">{info}</p>
      </>
    )}
  </div>
);

export const AreaPerformanceCard = ({
  area,
}: {
  area: { icon: string; name: string; percentage: number; correct: number; total: number; color: string };
}) => (
  <div className="rounded-2xl border border-cyan-500/20 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/20">
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Icon name={area.icon} className="text-3xl text-cyan-400" />
        <div>
          <h4 className="text-xl font-semibold text-white">{area.name}</h4>
          <p className="mt-2 bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-3xl font-black text-transparent">
            {area.percentage}%
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="mb-2 text-sm font-semibold text-slate-400">Respuestas</p>
        <p className="text-2xl font-black text-cyan-400">
          {area.correct}/{area.total}
        </p>
      </div>
    </div>
    <div className="h-2 overflow-hidden rounded-full border border-cyan-500/30 bg-slate-800/50">
      <div
        className={`bg-linear-to-r ${area.color} h-full transition-all duration-500`}
        style={{ width: `${area.percentage}%` }}
      ></div>
    </div>
  </div>
);

export const RecommendationsList = ({
  recommendations,
  icons,
  iconColors,
}: {
  recommendations: string[];
  icons: string[];
  iconColors: string[];
}) => (
  <div className="rounded-3xl border-2 border-orange-500/30 bg-linear-to-br from-orange-600/20 via-red-600/20 to-pink-600/20 p-12 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/20">
    <h3 className="mb-8 bg-linear-to-r from-orange-400 to-red-400 bg-clip-text text-2xl font-black text-transparent">
      🎯 Recomendaciones Personalizadas
    </h3>
    <ul className="space-y-4">
      {recommendations.map((recommendation: string, idx: number) => (
        <li key={idx} className="flex items-start gap-4">
          <Icon
            name={icons[idx % icons.length]}
            className={`${iconColors[idx % iconColors.length]} mt-1 shrink-0 text-xl`}
          />
          <span className="text-lg font-semibold text-slate-200">{recommendation}</span>
        </li>
      ))}
    </ul>
  </div>
);
