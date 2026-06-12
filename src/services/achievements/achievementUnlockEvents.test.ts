import { describe, expect, it, vi } from 'vitest';

import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { ACHIEVEMENT_UNLOCK_EVENT, achievementToUnlockPayload, emitAchievementUnlock } from './achievementUnlockEvents';

describe('achievementUnlockEvents', () => {
  it('emite un evento con el detalle del logro', () => {
    const handler = vi.fn();
    window.addEventListener(ACHIEVEMENT_UNLOCK_EVENT, handler);

    const achievement = ACHIEVEMENTS_DATA.find((item) => item.id === 'practice_1');
    expect(achievement).toBeDefined();

    emitAchievementUnlock(achievementToUnlockPayload(achievement!));

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]?.detail).toMatchObject({
      id: 'practice_1',
      title: achievement!.title,
    });

    window.removeEventListener(ACHIEVEMENT_UNLOCK_EVENT, handler);
  });
});
