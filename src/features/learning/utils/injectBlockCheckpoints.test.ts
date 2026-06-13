import { describe, expect, it } from 'vitest';
import { getBlockCheckpointId } from '@/features/learning/data/phase1Blocks';
import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import { injectBlockCheckpoints } from '@/features/learning/utils/injectBlockCheckpoints';

const lesson = (id: string, order: number, blockId?: string): LearningPathLesson => ({
  id,
  order,
  phase: 1,
  difficulty: 'facil',
  blockId,
  rewards: { xp: 50, coins: 25 },
});

describe('injectBlockCheckpoints', () => {
  it('inserta un checkpoint al final de cada bloque en fase 1', () => {
    const lessons = [
      lesson('m1', 1, 'numeros'),
      lesson('m2', 2, 'numeros'),
      lesson('m3', 26, 'algebra'),
    ];

    const result = injectBlockCheckpoints('matematicas', lessons, 1);
    const checkpointIds = result
      .filter((item) => item.moduleType === 'block-checkpoint')
      .map((item) => item.id);

    expect(checkpointIds).toContain(getBlockCheckpointId('matematicas', 'numeros'));
    expect(checkpointIds).toContain(getBlockCheckpointId('matematicas', 'algebra'));
    expect(result.findIndex((item) => item.id === 'm2')).toBeLessThan(
      result.findIndex((item) => item.id === getBlockCheckpointId('matematicas', 'numeros'))
    );
  });

  it('no modifica fases 2 o 3', () => {
    const lessons = [lesson('x', 1)];
    lessons[0].phase = 2;
    expect(injectBlockCheckpoints('matematicas', lessons, 2)).toEqual(lessons);
  });
});
