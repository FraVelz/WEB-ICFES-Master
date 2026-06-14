import { describe, expect, it } from 'vitest';
import {
  buildLegacyFullExamRedirect,
  buildLegacyPhaseSkipRedirect,
  buildLegacyPracticaRedirect,
  getPhaseSkipExamHref,
  getSimulacroAreaHref,
  getSimulacroCompletoExamHref,
  getSimulacroCompletoHref,
  getSimulacroCompletoSectionHref,
} from './simulacroNavigation';

describe('simulacroNavigation', () => {
  it('construye rutas de simulacro', () => {
    expect(getSimulacroCompletoSectionHref()).toBe('/simulacro-completo');
    expect(getSimulacroCompletoHref()).toBe('/simulacro-completo');
    expect(getSimulacroCompletoHref('/fases/matematicas')).toBe('/simulacro-completo');
    expect(getSimulacroCompletoExamHref('/fases/matematicas')).toBe('/simulacro/completo?from=%2Ffases%2Fmatematicas');
    expect(getSimulacroAreaHref('matematicas')).toBe('/simulacro/matematicas');
    expect(getPhaseSkipExamHref('lectura-critica', 'facil')).toBe('/simulacro/lectura-critica/fase?etapa=facil');
  });

  it('redirige rutas legacy', () => {
    expect(buildLegacyPracticaRedirect('ingles')).toBe('/simulacro/ingles');
    expect(buildLegacyFullExamRedirect('from=%2Ffases')).toBe('/simulacro-completo');
    expect(buildLegacyPhaseSkipRedirect('matematicas', 'intermedio')).toBe(
      '/simulacro/matematicas/fase?etapa=intermedio'
    );
  });
});
