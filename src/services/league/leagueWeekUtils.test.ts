import { describe, expect, it } from 'vitest';
import { getIsoWeekId } from './leagueWeekUtils';

describe('getIsoWeekId', () => {
  it('devuelve formato IYYY-Www', () => {
    const id = getIsoWeekId(new Date('2026-06-10T12:00:00Z'));
    expect(id).toMatch(/^\d{4}-W\d{2}$/);
  });
});
