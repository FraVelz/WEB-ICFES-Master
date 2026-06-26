import { describe, expect, it } from 'vitest';
import { extractMathLabels } from './katexA11y';

describe('extractMathLabels', () => {
  it('extracts block and inline math in document order', () => {
    const md = 'Texto $x^2$ y bloque $$\\frac{a}{b}$$ final.';
    expect(extractMathLabels(md)).toEqual(['x^2', '\\frac{a}{b}']);
  });

  it('returns empty array when there is no math', () => {
    expect(extractMathLabels('solo texto')).toEqual([]);
  });
});
