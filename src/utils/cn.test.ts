import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('combina clases condicionales', () => {
    const hidden = false as boolean;
    expect(cn('a', hidden && 'b', 'c')).toBe('a c');
  });

  it('fusiona clases de tailwind conflictivas', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
