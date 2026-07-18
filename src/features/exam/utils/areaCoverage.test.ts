import { describe, expect, it } from 'vitest';
import { formatPublishedCoverageLabel, isAreaCoverageEmpty, zeroCoverageForAreas } from './areaCoverage';

describe('areaCoverage', () => {
  it('formatea etiquetas según el conteo publicado', () => {
    expect(formatPublishedCoverageLabel(0)).toBe('Sin preguntas publicadas');
    expect(formatPublishedCoverageLabel(1)).toBe('1 pregunta publicada');
    expect(formatPublishedCoverageLabel(42)).toBe('42 preguntas publicadas');
  });

  it('detecta áreas vacías', () => {
    expect(isAreaCoverageEmpty(0)).toBe(true);
    expect(isAreaCoverageEmpty(undefined)).toBe(true);
    expect(isAreaCoverageEmpty(3)).toBe(false);
  });

  it('inicializa cobertura en cero', () => {
    expect(zeroCoverageForAreas(['matematicas', 'ingles'])).toEqual({
      matematicas: 0,
      ingles: 0,
    });
  });
});
