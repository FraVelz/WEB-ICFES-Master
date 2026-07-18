import { describe, expect, it } from 'vitest';

import {
  formatTimerAnnouncement,
  parsePracticeExamKey,
  shouldAnnounceTimerRemaining,
  TIMER_ARIA_LIVE_INTERVAL_SEC,
} from './practiceExamKeyboard';

describe('parsePracticeExamKey', () => {
  it('maps 1–4 and A–D to option indices', () => {
    expect(parsePracticeExamKey({ code: 'Digit1', key: '1' })).toEqual({
      type: 'selectOption',
      optionIndex: 0,
    });
    expect(parsePracticeExamKey({ code: 'Digit4', key: '4' })).toEqual({
      type: 'selectOption',
      optionIndex: 3,
    });
    expect(parsePracticeExamKey({ code: 'KeyB', key: 'b' })).toEqual({
      type: 'selectOption',
      optionIndex: 1,
    });
  });

  it('maps N / P / F navigation and flag', () => {
    expect(parsePracticeExamKey({ code: 'KeyN', key: 'n' })).toEqual({ type: 'next' });
    expect(parsePracticeExamKey({ code: 'KeyP', key: 'p' })).toEqual({ type: 'prev' });
    expect(parsePracticeExamKey({ code: 'KeyF', key: 'f' })).toEqual({ type: 'toggleFlag' });
  });

  it('ignores modified shortcuts', () => {
    expect(parsePracticeExamKey({ code: 'KeyN', key: 'n', ctrlKey: true })).toBeNull();
    expect(parsePracticeExamKey({ code: 'Digit1', key: '1', metaKey: true })).toBeNull();
  });
});

describe('shouldAnnounceTimerRemaining', () => {
  it('announces on first tick and every 5 minutes', () => {
    expect(shouldAnnounceTimerRemaining(900, null)).toBe(true);
    expect(shouldAnnounceTimerRemaining(899, 900)).toBe(false);
    expect(shouldAnnounceTimerRemaining(600, 900)).toBe(true);
    expect(shouldAnnounceTimerRemaining(599, 600)).toBe(false);
    expect(shouldAnnounceTimerRemaining(0, 1)).toBe(true);
  });

  it('uses the documented 5-minute interval', () => {
    expect(TIMER_ARIA_LIVE_INTERVAL_SEC).toBe(300);
  });
});

describe('formatTimerAnnouncement', () => {
  it('formats minutes and zero', () => {
    expect(formatTimerAnnouncement(0)).toBe('Tiempo agotado');
    expect(formatTimerAnnouncement(60)).toBe('Queda 1 minuto');
    expect(formatTimerAnnouncement(300)).toBe('Quedan 5 minutos');
    expect(formatTimerAnnouncement(90)).toBe('Queda 1 minuto y 30 segundos');
  });
});
