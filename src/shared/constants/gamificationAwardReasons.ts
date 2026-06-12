/** Patrones de `reason` / `item` permitidos en `/api/gamification/award`. */

const LESSON_QUIZ = /^lesson_quiz_[a-zA-Z0-9_-]{1,48}$/;
const PRACTICE_XP = /^practice_\d+$/;
const EXAM_FULL_XP = /^exam_full_\d+$/;
const ACHIEVEMENT = /^achievement(_[a-z0-9_]+)?$/;
const SHOP_ITEM = /^shop_[a-z0-9_-]+$/;

const EXACT_XP_REASONS = new Set(['demo_migration', 'achievement']);
const EXACT_COINS_REASONS = new Set(['demo_migration', 'achievement', 'reward', 'user_wallet', 'use_user']);
const EXACT_SPEND_ITEMS = new Set(['purchase', 'user_wallet', 'use_user', 'shop_item']);

export function isAllowedXpAwardReason(reason: string): boolean {
  const trimmed = reason.trim();
  if (trimmed.length === 0 || trimmed.length > 64) return false;
  if (EXACT_XP_REASONS.has(trimmed)) return true;
  return (
    LESSON_QUIZ.test(trimmed) ||
    PRACTICE_XP.test(trimmed) ||
    EXAM_FULL_XP.test(trimmed) ||
    ACHIEVEMENT.test(trimmed)
  );
}

export function isAllowedCoinsAwardReason(reason: string): boolean {
  const trimmed = reason.trim();
  if (trimmed.length === 0 || trimmed.length > 64) return false;
  if (EXACT_COINS_REASONS.has(trimmed)) return true;
  return LESSON_QUIZ.test(trimmed) || ACHIEVEMENT.test(trimmed);
}

export function isAllowedSpendCoinsItem(item: string): boolean {
  const trimmed = item.trim();
  if (trimmed.length === 0 || trimmed.length > 64) return false;
  if (EXACT_SPEND_ITEMS.has(trimmed)) return true;
  return SHOP_ITEM.test(trimmed);
}
