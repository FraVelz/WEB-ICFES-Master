import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { isBillingEnabled, isOpenAIEnabled } from '@/config/featureFlags';

const SRC_ROOT = join(process.cwd(), 'src');

/** Phrases that would imply a live paid-plan CTA while billing is off. */
const FORBIDDEN_BILLING_CTA = [
  /Hazte\s+Pro/i,
  /upgrade\s+to\s+Pro/i,
  /upgrade\s+a\s+Pro/i,
  /plan\s+Premium/i,
  /Suscr[ií]bete\s+a\s+Pro/i,
  /Free\/Pro\/Premium/i,
];

function walkTsxFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.next') continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkTsxFiles(full, out);
    else if (/\.(tsx|ts)$/.test(name) && !name.endsWith('.test.ts') && !name.endsWith('.test.tsx')) {
      out.push(full);
    }
  }
  return out;
}

describe('billing / OpenAI UI guardrails (B1-3)', () => {
  it('defaults billing and OpenAI off without env', () => {
    delete process.env.BILLING_ENABLED;
    delete process.env.NEXT_PUBLIC_BILLING_ENABLED;
    delete process.env.OPENAI_ENABLED;
    delete process.env.NEXT_PUBLIC_OPENAI_ENABLED;
    delete process.env.OPENAI_API_KEY;
    expect(isBillingEnabled()).toBe(false);
    expect(isOpenAIEnabled()).toBe(false);
  });

  it('has no dead Pro/Premium upgrade CTAs in app source', () => {
    const offenders: string[] = [];
    for (const file of walkTsxFiles(SRC_ROOT)) {
      // Allow the feature-flag module comment that documents Free/Pro/Premium.
      if (file.endsWith(`${join('config', 'featureFlags.ts')}`)) continue;
      const text = readFileSync(file, 'utf8');
      for (const pattern of FORBIDDEN_BILLING_CTA) {
        if (pattern.test(text)) {
          offenders.push(`${file} ~ ${pattern}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
