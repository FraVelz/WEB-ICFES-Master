import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Servicio para gestionar el contenido de aprendizaje desde Firestore.
 * Centraliza todas las consultas a la base de datos para el módulo de aprendizaje.
 */
export const LearningService = {
  /**
   * Obtiene todas las lecciones de una materia, ordenadas por 'order'.
   * @param {string} areaId - ID de la materia (ej: 'lectura-critica')
   * @returns {Promise<Array>} Lista de lecciones
   */
  getLearningPath: async (areaId) => {
    try {
      // Mapeo de excepciones para nombres de colección
      // 'sociales-ciudadanas' en la app mapea a 'learning_sociales' en Firestore
      const COLLECTION_EXCEPTIONS = {
        'sociales-ciudadanas': 'learning_sociales'
      };

      // Normalizar nombre de colección (ej: lectura-critica -> learning_lectura_critica)
      const collectionName = COLLECTION_EXCEPTIONS[areaId] || `learning_${areaId.replace(/-/g, '_')}`;
      
      // console.log(`[LearningService] Cargando materia: ${areaId} desde colección: ${collectionName}`);

      const q = query(
        collection(db, collectionName),
        orderBy('order', 'asc')
      );

      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error fetching learning path for ${areaId}:`, error);
      // En caso de error (ej: colección no existe), retornamos array vacío para no romper la UI
      return [];
    }
  },

  /**
   * Obtiene el progreso del usuario para una materia específica.
   * @param {string} userId 
   * @param {string} areaId 
   */
  getUserProgress: async (userId, areaId) => {
    try {
      const docRef = doc(db, 'users', userId, 'progress', areaId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Retornar estructura base si no existe
        return { completedLessons: [], currentLevel: 0, totalXP: 0 };
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
      return null;
    }
  }
};
