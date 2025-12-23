export const getBadgeCategory = (badgeId) => {
  if (
    badgeId.includes('PLAN') ||
    badgeId.includes('ANNUAL') ||
    badgeId.includes('FREE') ||
    badgeId.includes('PRO') ||
    badgeId.includes('PREMIUM') ||
    badgeId.includes('LIFETIME') ||
    badgeId.includes('SUBSCRIBER') ||
    badgeId.includes('COMMITMENT') ||
    badgeId.includes('LEGEND')
  ) {
    return 'planes';
  }

  if (badgeId.includes('STREAK')) {
    return 'streak';
  }

  if (
    badgeId.includes('MASTER') ||
    badgeId.includes('EXAM') ||
    badgeId.includes('HUNDRED_QUIZZES') ||
    badgeId.includes('QUIZZES') ||
    badgeId.includes('PERFECT')
  ) {
    return 'logros';
  }

  if (
    badgeId.includes('NINETY') ||
    badgeId.includes('CONSISTENCY') ||
    badgeId.includes('SPEED') ||
    badgeId.includes('ALL_AREAS')
  ) {
    return 'excelencia';
  }

  if (badgeId.includes('FIRST')) {
    return 'primeros_pasos';
  }

  return 'primeros_pasos';
};
