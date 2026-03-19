export const RANKS = {
  NOVATO: {
    id: 'novato',
    label: 'Novato',
    order: 1,
    color: 'from-slate-400 to-slate-600',
    icon: '🌱',
    promoteCount: 15,
    demoteCount: 0,
  },
  EXPLORADOR: {
    id: 'explorador',
    label: 'Explorador',
    order: 2,
    color: 'from-emerald-400 to-emerald-600',
    icon: '🧭',
    promoteCount: 10,
    demoteCount: 5,
  },
  APRENDIZ: {
    id: 'aprendiz',
    label: 'Aprendiz',
    order: 3,
    color: 'from-blue-400 to-blue-600',
    icon: '📚',
    promoteCount: 10,
    demoteCount: 10,
  },
  COMPETENTE: {
    id: 'competente',
    label: 'Competente',
    order: 4,
    color: 'from-cyan-400 to-cyan-600',
    icon: '💡',
    promoteCount: 5,
    demoteCount: 10,
  },
  AVANZADO: {
    id: 'avanzado',
    label: 'Avanzado',
    order: 5,
    color: 'from-purple-400 to-purple-600',
    icon: '⚡',
    promoteCount: 5,
    demoteCount: 10,
  },
  EXPERTO: {
    id: 'experto',
    label: 'Experto',
    order: 6,
    color: 'from-orange-400 to-orange-600',
    icon: '🔥',
    promoteCount: 3,
    demoteCount: 10,
  },
  MAESTRO: {
    id: 'maestro',
    label: 'Maestro',
    order: 7,
    color: 'from-yellow-400 to-yellow-600',
    icon: '👑',
    promoteCount: 0,
    demoteCount: 5,
  },
};

export const getRankInfo = (rankId) => {
  return Object.values(RANKS).find((r) => r.id === rankId) || RANKS.NOVATO;
};

export const getNextRank = (currentRankId) => {
  const current = getRankInfo(currentRankId);
  return Object.values(RANKS).find((r) => r.order === current.order + 1);
};

export const getPrevRank = (currentRankId) => {
  const current = getRankInfo(currentRankId);
  return Object.values(RANKS).find((r) => r.order === current.order - 1);
};
