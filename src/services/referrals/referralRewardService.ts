import { REFERRAL_ACHIEVEMENT_IDS } from '@/shared/constants/achievements/achievementsReferrals';
import { LEARNING_PROGRESS_META_KEY } from '@/services/learning/learningProgressTypes';
import { syncAchievementChainFromCount } from '@/services/achievements/serverAchievementSync';
import { addCoinsServer, addXpServer, getProfileRow } from '@/services/supabase/gamification/gamificationServerEconomy';
import { createServiceRoleClient } from '@/config/supabaseServiceRole';
import { REFERRAL_QUALIFY_COINS, REFERRAL_QUALIFY_XP, referralQualifiedReason } from './referralConstants';

type LearningProgressMeta = {
  completedLessons?: string[];
};

function readCompletedLessonCount(achievementsRaw: unknown): number {
  if (typeof achievementsRaw !== 'object' || achievementsRaw === null || Array.isArray(achievementsRaw)) {
    return 0;
  }
  const meta = (achievementsRaw as Record<string, unknown>)[LEARNING_PROGRESS_META_KEY] as
    | LearningProgressMeta
    | undefined;
  const lessons = meta?.completedLessons;
  return Array.isArray(lessons) ? lessons.length : 0;
}

export type QualifyReferralResult = {
  qualified: boolean;
  rewarded: boolean;
  referrerId?: string;
  newlyUnlockedAchievements?: string[];
};

/** Califica referido cuando el invitee completa al menos una lección (server-side). */
export async function qualifyReferralForInvitee(inviteeId: string): Promise<QualifyReferralResult> {
  const sb = createServiceRoleClient();
  if (!sb) throw new Error('Supabase service role no configurado');

  const { data: inviteeRow, error: inviteeError } = await sb
    .from('users')
    .select('id, referred_by')
    .eq('id', inviteeId)
    .maybeSingle();

  if (inviteeError) throw new Error(inviteeError.message);
  if (!inviteeRow?.referred_by) {
    return { qualified: false, rewarded: false };
  }

  const referrerId = String(inviteeRow.referred_by);
  if (referrerId === inviteeId) {
    return { qualified: false, rewarded: false };
  }

  const { profile } = await getProfileRow(inviteeId);
  const lessonCount = readCompletedLessonCount(profile?.achievements);
  if (lessonCount < 1) {
    return { qualified: false, rewarded: false };
  }

  const { data: referralRow, error: referralError } = await sb
    .from('referrals')
    .select('id, status')
    .eq('invitee_id', inviteeId)
    .maybeSingle();

  if (referralError) throw new Error(referralError.message);

  if (!referralRow) {
    const { error: insertError } = await sb.from('referrals').insert({
      referrer_id: referrerId,
      invitee_id: inviteeId,
      status: 'pending',
    });
    if (insertError && !insertError.message.includes('duplicate')) {
      throw new Error(insertError.message);
    }
  } else if (referralRow.status === 'rewarded' || referralRow.status === 'qualified') {
    return { qualified: true, rewarded: false, referrerId };
  }

  const now = new Date().toISOString();
  const reason = referralQualifiedReason(inviteeId);

  const [xpResult, coinsResult] = await Promise.all([
    addXpServer(referrerId, REFERRAL_QUALIFY_XP, reason),
    addCoinsServer(referrerId, REFERRAL_QUALIFY_COINS, reason),
  ]);

  const rewarded = xpResult.awarded || coinsResult.awarded;

  await sb
    .from('referrals')
    .update({
      status: rewarded ? 'rewarded' : 'qualified',
      qualified_at: now,
      rewarded_at: rewarded ? now : null,
    })
    .eq('invitee_id', inviteeId);

  const { data: gamRow } = await sb
    .from('user_gamification')
    .select('referral_qualified_count')
    .eq('user_id', referrerId)
    .maybeSingle();

  const currentCount = Number(gamRow?.referral_qualified_count ?? 0);
  const newCount = rewarded ? currentCount + 1 : currentCount;

  const { newlyUnlocked } = await syncAchievementChainFromCount(
    referrerId,
    REFERRAL_ACHIEVEMENT_IDS,
    newCount,
    'referral_qualified_count'
  );

  return {
    qualified: true,
    rewarded,
    referrerId,
    newlyUnlockedAchievements: newlyUnlocked,
  };
}
