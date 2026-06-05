import { describe, expect, it } from 'vitest';

import { getStaticRoadmapDataKey } from './roadmapAreaKeys';

describe('roadmapAreaKeys', () => {
  it('normaliza claves de roadmapData estático', () => {
    expect(getStaticRoadmapDataKey('sociales-ciudadanas')).toBe('sociales');
    expect(getStaticRoadmapDataKey('matematicas')).toBe('matematicas');
    expect(getStaticRoadmapDataKey('desconocido')).toBe('desconocido');
  });
});
