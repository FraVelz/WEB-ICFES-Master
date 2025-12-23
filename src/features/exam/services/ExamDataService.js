import { doc, collection, setDoc, getDoc, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Servicio para manejar exámenes en Firestore
 * Maneja: Crear, obtener, actualizar exámenes y respuestas de usuarios
 */
class ExamFirestoreDataService {
  /**
   * Crea un nuevo examen
   * @param {Object} examData - Datos del examen
   * @returns {Promise<string>} - ID del examen creado
   */
  async createExam(examData) {
    try {
      const examsRef = collection(db, 'exams');
      const docRef = await addDoc(examsRef, {
        ...examData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al crear examen:', error);
      throw error;
    }
  }

  /**
   * Obtiene un examen por ID
   * @param {string} examId - ID del examen
   * @returns {Promise<Object|null>}
   */
  async getExam(examId) {
    try {
      const examRef = doc(db, 'exams', examId);
      const examDoc = await getDoc(examRef);
      
      if (examDoc.exists()) {
        return { id: examDoc.id, ...examDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener examen:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los exámenes disponibles
   * @returns {Promise<Array>}
   */
  async getAllExams() {
    try {
      const examsRef = collection(db, 'exams');
      const snapshot = await getDocs(examsRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener exámenes:', error);
      throw error;
    }
  }

  /**
   * Guarda las respuestas de un usuario en un examen
   * @param {string} userId - ID del usuario
   * @param {string} examId - ID del examen
   * @param {Object} answers - Respuestas del usuario
   * @returns {Promise<void>}
   */
  async saveExamAnswers(userId, examId, answers) {
    try {
      const answerRef = doc(db, 'userExams', `${userId}_${examId}`);
      await setDoc(answerRef, {
        userId,
        examId,
        answers,
        completedAt: Timestamp.now(),
        score: this.calculateScore(answers)
      });
    } catch (error) {
      console.error('Error al guardar respuestas:', error);
      throw error;
    }
  }

  /**
   * Obtiene las respuestas guardadas del usuario
   * @param {string} userId - ID del usuario
   * @param {string} examId - ID del examen
   * @returns {Promise<Object|null>}
   */
  async getUserExamAnswers(userId, examId) {
    try {
      const answerRef = doc(db, 'userExams', `${userId}_${examId}`);
      const answerDoc = await getDoc(answerRef);
      
      if (answerDoc.exists()) {
        return { id: answerDoc.id, ...answerDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener respuestas del usuario:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los exámenes completados por un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>}
   */
  async getUserExamHistory(userId) {
    try {
      const q = query(collection(db, 'userExams'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener historial de exámenes:', error);
      throw error;
    }
  }

  /**
   * Calcula el puntaje de las respuestas (método básico)
   * @param {Object} answers - Respuestas del usuario
   * @returns {number}
   */
  calculateScore(answers) {
    // Este método se puede personalizar según tu lógica
    let score = 0;
    for (const [, answer] of Object.entries(answers)) {
      if (answer.isCorrect) {
        score += answer.points || 1;
      }
    }
    return score;
  }
}

export default new ExamFirestoreDataService();
