/**
 * Hook para manejar la expansión de secciones del mapa
 */
import { useState } from 'react';

type LevelKey = 'basico' | 'intermedio' | 'avanzado';
type SubjectKey = string | null;

export const useLevelExpansion = () => {
  const [expandedLevel, setExpandedLevel] = useState<string | null>('basico');
  const [expandedSubject, setExpandedSubject] = useState<Record<string, SubjectKey>>({
    basico: 'matematicas',
    intermedio: null,
    avanzado: null,
  });

  const handleToggleLevel = (level: string) => {
    setExpandedLevel(expandedLevel === level ? null : level);
  };

  const handleToggleSubject = (level: LevelKey, subject: string) => {
    setExpandedSubject((prev) => ({
      ...prev,
      [level]: prev[level] === subject ? null : subject,
    }));
  };

  return {
    expandedLevel,
    expandedSubject,
    handleToggleLevel,
    handleToggleSubject,
  };
};
