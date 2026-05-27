import { describe, expect, it } from 'vitest';
import { CHAT_ANON_COOKIE, CHAT_ANON_LIMIT } from './chatAnonQuota';

describe('chatAnonQuota', () => {
  it('exposes shared cookie key and limit', () => {
    expect(CHAT_ANON_COOKIE).toBe('icfes_chat_anon_used');
    expect(CHAT_ANON_LIMIT).toBe(3);
  });
});
