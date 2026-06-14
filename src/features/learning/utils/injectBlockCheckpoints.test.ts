import { describe, expect, it } from 'vitest';
import { getBlockCheckpointId } from '@/features/learning/data/phase1Blocks';
import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import { injectBlockCheckpoints } from '@/features/learning/utils/injectBlockCheckpoints';

const lesson = (id: string, order: number, blockId?: string, phase = 1): LearningPathLesson => ({
  id,
  order,
  phase,
  difficulty: phase === 1 ? 'facil' : phase === 2 ? 'intermedio' : 'dificil',
  blockId,
  rewards: { xp: 50, coins: 25 },
});

describe('injectBlockCheckpoints', () => {
  it('inserta un checkpoint al final de cada bloque en fase 1', () => {
    const lessons = [lesson('m1', 1, 'numeros'), lesson('m2', 2, 'numeros'), lesson('m3', 26, 'algebra')];

    const result = injectBlockCheckpoints('matematicas', lessons, 1);
    const checkpointIds = result.filter((item) => item.moduleType === 'block-checkpoint').map((item) => item.id);

    expect(checkpointIds).toContain(getBlockCheckpointId('matematicas', 'numeros'));
    expect(checkpointIds).toContain(getBlockCheckpointId('matematicas', 'algebra'));
    expect(result.findIndex((item) => item.id === 'm2')).toBeLessThan(
      result.findIndex((item) => item.id === getBlockCheckpointId('matematicas', 'numeros'))
    );
  });

  it('inserta checkpoints en fase 2 por bloques de order_index', () => {
    const lessons = [lesson('f2-1', 1, undefined, 2), lesson('f2-2', 26, undefined, 2)];

    const result = injectBlockCheckpoints('matematicas', lessons, 2);
    const checkpoints = result.filter((item) => item.moduleType === 'block-checkpoint');

    expect(checkpoints.length).toBeGreaterThanOrEqual(1);
    expect(checkpoints[0]?.phase).toBe(2);
    expect(checkpoints[0]?.difficulty).toBe('intermedio');
  });

  it('deja intactas lecciones de otras fases', () => {
    const lessons = [lesson('x', 1, undefined, 3)];
    const other = { ...lessons[0], id: 'phase1', phase: 1 as const };
    const input = [other, ...lessons];
    const result = injectBlockCheckpoints('matematicas', input, 2);
    expect(result.filter((item) => item.phase === 1)).toHaveLength(1);
  });
});
