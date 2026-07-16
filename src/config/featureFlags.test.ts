import { afterEach, describe, expect, it } from 'vitest';
import { isBillingEnabled, isOpenAIEnabled, isOpenAIEnabledClient } from './featureFlags';

describe('featureFlags', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('isBillingEnabled', () => {
    it('defaults to false when unset', () => {
      delete process.env.BILLING_ENABLED;
      delete process.env.NEXT_PUBLIC_BILLING_ENABLED;
      expect(isBillingEnabled()).toBe(false);
    });

    it('is true when BILLING_ENABLED=true', () => {
      delete process.env.NEXT_PUBLIC_BILLING_ENABLED;
      process.env.BILLING_ENABLED = 'true';
      expect(isBillingEnabled()).toBe(true);
    });

    it('is true when NEXT_PUBLIC_BILLING_ENABLED=1', () => {
      delete process.env.BILLING_ENABLED;
      process.env.NEXT_PUBLIC_BILLING_ENABLED = '1';
      expect(isBillingEnabled()).toBe(true);
    });

    it('is false for non-truthy values', () => {
      process.env.BILLING_ENABLED = 'false';
      process.env.NEXT_PUBLIC_BILLING_ENABLED = 'no';
      expect(isBillingEnabled()).toBe(false);
    });
  });

  describe('isOpenAIEnabled', () => {
    it('defaults to false without flag or key', () => {
      delete process.env.OPENAI_ENABLED;
      delete process.env.NEXT_PUBLIC_OPENAI_ENABLED;
      delete process.env.OPENAI_API_KEY;
      expect(isOpenAIEnabled()).toBe(false);
    });

    it('is false when flag is on but key is missing', () => {
      process.env.OPENAI_ENABLED = 'true';
      delete process.env.NEXT_PUBLIC_OPENAI_ENABLED;
      delete process.env.OPENAI_API_KEY;
      expect(isOpenAIEnabled()).toBe(false);
    });

    it('is false when key is set but flag is off', () => {
      delete process.env.OPENAI_ENABLED;
      delete process.env.NEXT_PUBLIC_OPENAI_ENABLED;
      process.env.OPENAI_API_KEY = 'sk-test';
      expect(isOpenAIEnabled()).toBe(false);
    });

    it('is true when flag and key are both set', () => {
      process.env.OPENAI_ENABLED = 'true';
      process.env.OPENAI_API_KEY = 'sk-test';
      expect(isOpenAIEnabled()).toBe(true);
    });
  });

  describe('isOpenAIEnabledClient', () => {
    it('follows NEXT_PUBLIC_OPENAI_ENABLED only', () => {
      delete process.env.NEXT_PUBLIC_OPENAI_ENABLED;
      process.env.OPENAI_ENABLED = 'true';
      process.env.OPENAI_API_KEY = 'sk-test';
      expect(isOpenAIEnabledClient()).toBe(false);

      process.env.NEXT_PUBLIC_OPENAI_ENABLED = 'true';
      expect(isOpenAIEnabledClient()).toBe(true);
    });
  });
});
