import { doc, collection, setDoc, getDoc, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Servicio para manejar materiales de aprendizaje en Firestore
 * Maneja: Lecciones, materiales, recursos
 */
class LearningMaterialService {
  /**
   * Obtiene todas las lecciones de un área
   * @param {string} area - Área/asignatura
   * @returns {Promise<Array>}
   */
  async getLessonsByArea(area) {
    try {
      const lessonsRef = collection(db, 'learningMaterials');
      const snapshot = await getDocs(lessonsRef);
      
      const lessons = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(lesson => lesson.area === area);
      
      return lessons;
    } catch (error) {
      console.error('Error al obtener lecciones:', error);
      throw error;
    }
  }

  /**
   * Obtiene una lección específica
   * @param {string} lessonId - ID de la lección
   * @returns {Promise<Object|null>}
   */
  async getLesson(lessonId) {
    try {
      const lessonRef = doc(db, 'learningMaterials', lessonId);
      const lessonDoc = await getDoc(lessonRef);
      
      if (lessonDoc.exists()) {
        return { id: lessonDoc.id, ...lessonDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener lección:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva lección
   * @param {Object} lessonData - Datos de la lección
   * @returns {Promise<string>} - ID de la lección creada
   */
  async createLesson(lessonData) {
    try {
      const lessonsRef = collection(db, 'learningMaterials');
      const docRef = await addDoc(lessonsRef, {
        ...lessonData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al crear lección:', error);
      throw error;
    }
  }

  /**
   * Marca una lección como completada por el usuario
   * @param {string} userId - ID del usuario
   * @param {string} lessonId - ID de la lección
   * @returns {Promise<void>}
   */
  async markLessonAsCompleted(userId, lessonId) {
    try {
      const completedRef = doc(db, 'userLessons', `${userId}_${lessonId}`);
      await setDoc(completedRef, {
        userId,
        lessonId,
        completedAt: Timestamp.now(),
        status: 'completed'
      });
    } catch (error) {
      console.error('Error al marcar lección como completada:', error);
      throw error;
    }
  }

  /**
   * Obtiene el progreso de un usuario en las lecciones
   * @param {string} userId - ID del usuario
   * @param {string} area - Área/asignatura
   * @returns {Promise<Object>}
   */
  async getUserLessonsProgress(userId, area) {
    try {
      const lessons = await this.getLessonsByArea(area);
      const completedCount = lessons.filter(lesson => 
        // Verificar si la lección fue completada
        lesson.completedByUsers?.includes(userId)
      ).length;

      return {
        totalLessons: lessons.length,
        completedLessons: completedCount,
        progress: (completedCount / lessons.length) * 100 || 0
      };
    } catch (error) {
      console.error('Error al obtener progreso en lecciones:', error);
      throw error;
    }
  }
}

export default new LearningMaterialService();
