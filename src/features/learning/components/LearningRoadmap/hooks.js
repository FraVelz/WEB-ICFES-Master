/**
 * Hook para manejar la expansión de secciones del mapa
 */
import { useState } from 'react';

export const useLevelExpansion = () => {
  const [expandedLevel, setExpandedLevel] = useState('basico');
  const [expandedSubject, setExpandedSubject] = useState({
    basico: 'matematicas',
    intermedio: null,
    avanzado: null,
  });

  const handleToggleLevel = (level) => {
    setExpandedLevel(expandedLevel === level ? null : level);
  };

  const handleToggleSubject = (level, subject) => {
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
