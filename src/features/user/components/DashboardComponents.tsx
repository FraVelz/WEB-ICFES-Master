import { Icon } from '@/shared/components/Icon';
import Link from 'next/link';

export const QuickStatCard = ({
  stat,
  value,
  icon,
  color,
}: {
  stat: string;
  value: string | number;
  icon: string;
  color: string;
}) => (
  <div
    className={`bg-linear-to-br ${color} rounded-lg border border-slate-700/50 p-6 text-white shadow-lg transition-transform duration-300 hover:scale-105`}
  >
    <div className="mb-3 flex items-center justify-between">
      <p className="text-sm font-semibold opacity-90">{stat}</p>
      <Icon name={icon} className="text-xl opacity-70" />
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export const DailyGoalCard = ({
  percentage,
  current,
  target,
}: {
  percentage: number;
  current: number;
  target: number;
}) => (
  <div className="mb-8 rounded-xl border border-slate-700 bg-linear-to-r from-slate-800 to-slate-900 p-6">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="flex items-center gap-2 text-2xl font-bold text-white">🎯 Meta del Día</h3>
      <span className="text-2xl font-bold text-amber-400">{percentage}%</span>
    </div>
    <p className="mb-4 text-slate-400">
      {current} / {target} XP ganados
    </p>
    <div className="mb-3 h-3 overflow-hidden rounded-full bg-slate-700">
      <div
        className="h-full bg-linear-to-r from-amber-600 to-yellow-600 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
    <p className="text-sm text-slate-500">Te faltan {target - current} XP para completar hoy 🔥</p>
  </div>
);

export const ProgressBar = ({ percentage, label, info }: { percentage: number; label: string; info?: string }) => (
  <div className="mb-6 rounded-xl border border-slate-700 bg-linear-to-r from-slate-800 to-slate-900 p-6">
    <div className="mb-3 flex items-center justify-between">
      <div>
        <h3 className="mb-1 text-lg font-bold text-white">{label}</h3>
        <p className="text-sm text-slate-400">{info}</p>
      </div>
      <div className="text-right">
        <div className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
          {percentage}%
        </div>
      </div>
    </div>
    <div className="h-4 overflow-hidden rounded-full border border-slate-600 bg-slate-700">
      <div
        className="h-full bg-linear-to-r from-blue-600 to-purple-600 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

interface NavCard {
  link: string;
  badge?: string;
  color?: string;
  icon: string;
  title: string;
  description: string;
}
export const NavigationCard = ({ card }: { card: NavCard }) => (
  <Link
    href={card.link}
    className="group relative rounded-xl border border-slate-700 bg-slate-800/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-600 hover:shadow-lg"
  >
    {card.badge && (
      <div className="absolute -top-2 -right-2 rounded-full bg-linear-to-r from-blue-600 to-purple-600 px-3 py-1 text-xs font-bold text-white">
        {card.badge}
      </div>
    )}

    <div
      className={`rounded-lg bg-linear-to-br p-3 ${card.color} mb-3 inline-block text-white transition-transform duration-300 group-hover:scale-110`}
    >
      <Icon name={card.icon} className="text-xl" />
    </div>

    <h3 className="mb-1 font-bold text-white">{card.title}</h3>
    <p className="text-xs text-slate-400">{card.description}</p>

    <div className="mt-4 flex items-center gap-2 text-blue-400 transition-colors group-hover:text-blue-300">
      <span className="text-xs font-semibold">Ir</span>
      <Icon name="arrow-right" className="transition-transform group-hover:translate-x-1" />
    </div>
  </Link>
);

export const RecommendedSessionItem = ({
  session,
}: {
  session: { area: string; nivel: string; tiempo: string; puntos: number };
}) => (
  <div className="flex items-center justify-between rounded-lg bg-slate-700/50 p-4 transition-colors hover:bg-slate-700">
    <div>
      <p className="font-semibold text-white">{session.area}</p>
      <p className="text-sm text-slate-400">{session.nivel}</p>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-sm text-slate-400">{session.tiempo}</span>
      <span className="rounded-full bg-yellow-600/30 px-3 py-1 text-sm font-semibold text-yellow-300">
        +{session.puntos} XP
      </span>
    </div>
  </div>
);
