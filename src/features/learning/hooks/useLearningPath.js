import { useState, useEffect } from 'react';
import { LearningService } from '../services/LearningService';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook para manejar la lógica de la ruta de aprendizaje.
 * Transforma los datos planos de Firestore en la estructura de secciones que necesita el UI.
 */
export const useLearningPath = (areaId) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPath = async () => {
      if (!areaId) return;
      
      setLoading(true);
      try {
        // 1. Obtener lecciones y progreso en paralelo
        const [lessons, progress] = await Promise.all([
          LearningService.getLearningPath(areaId),
          user ? LearningService.getUserProgress(user.uid, areaId) : Promise.resolve(null)
        ]);

        // 2. Agrupar lecciones por dificultad para mantener el diseño de "Secciones"
        const groupedSections = [
          {
            id: 'facil',
            title: 'Nivel Básico – Fundamentos',
            description: 'Domina los conceptos esenciales',
            nodes: []
          },
          {
            id: 'intermedio',
            title: 'Nivel Intermedio – Práctica',
            description: 'Aplica lo aprendido en preguntas tipo ICFES',
            nodes: []
          },
          {
            id: 'dificil',
            title: 'Nivel Avanzado – Maestría',
            description: 'Retos complejos para expertos',
            nodes: []
          }
        ];

        // 3. Distribuir lecciones en las secciones
        lessons.forEach(lesson => {
          // Normalizar dificultad a minúsculas por si acaso
          const difficulty = lesson.difficulty?.toLowerCase() || 'facil';
          const sectionIndex = groupedSections.findIndex(s => s.id === difficulty);
          
          if (sectionIndex !== -1) {
            // Calcular estado basado en progreso
            let status = 'locked';
            const isCompleted = progress?.completedLessons?.includes(lesson.id);
            
            if (isCompleted) {
              status = 'completed';
            } else {
              // Lógica simple: si no está completada, verificar si es la primera disponible
              // Por defecto dejamos 'available' para que el usuario pueda verlas
              // En una implementación estricta, verificaríamos si la anterior está completada
              status = 'available'; 
            }

            // Aplanar recompensas para que el UI las entienda
            const xp = lesson.rewards?.xp || lesson.xp || 0;
            const coins = lesson.rewards?.coins || lesson.coins || 0;

            groupedSections[sectionIndex].nodes.push({
              ...lesson,
              xp,
              coins,
              type: 'lesson', // Asegurar que el UI sepa que es lección
              status
            });
          }
        });

        // Filtrar secciones vacías
        const activeSections = groupedSections.filter(s => s.nodes.length > 0);
        
        setSections(activeSections);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la ruta de aprendizaje');
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [areaId, user]);

  return { sections, loading, error };
};
