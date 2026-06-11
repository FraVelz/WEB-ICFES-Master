import type { MyLeagueState } from '@/services/league';
import { LEAGUE_GROUP_SIZE } from '@/shared/constants/gamification';

export type ProfileLeagueDisplay = {
  leagueRank: string;
  weeklyXp: number;
  groupNumber: number | null;
  memberCount: number | null;
  groupSize: number;
  myPosition: number | null;
  inGroup: boolean;
};

export const EMPTY_PROFILE_LEAGUE: ProfileLeagueDisplay = {
  leagueRank: 'novato',
  weeklyXp: 0,
  groupNumber: null,
  memberCount: null,
  groupSize: LEAGUE_GROUP_SIZE,
  myPosition: null,
  inGroup: false,
};

export function mapMyLeagueToDisplay(state: MyLeagueState | null, fallbackRank = 'novato'): ProfileLeagueDisplay {
  if (!state) {
    return { ...EMPTY_PROFILE_LEAGUE, leagueRank: fallbackRank };
  }

  const inGroup = Boolean(state.leagueGroupId);

  return {
    leagueRank: state.leagueRank || fallbackRank,
    weeklyXp: state.weeklyXp,
    groupNumber: inGroup ? state.groupNumber : null,
    memberCount: inGroup ? state.memberCount : null,
    groupSize: state.groupSize || LEAGUE_GROUP_SIZE,
    myPosition: inGroup && state.weeklyXp > 0 ? state.myPosition : null,
    inGroup,
  };
}
