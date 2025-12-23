import { useState, useEffect } from 'react';
import { db } from '@/config/firebase';
import { doc, onSnapshot, setDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { generateDailyChallenges } from '../utils/challengeGenerator';

export const useDailyChallengesFirebase = (dateString) => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completed: 0, total: 0, totalXP: 0 });

  // Fecha actual por defecto si no se pasa
  const targetDate = dateString || new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    const challengesRef = doc(db, 'users', user.uid, 'dailyChallenges', targetDate);

    const unsubscribe = onSnapshot(challengesRef, async (docSnap) => {
      if (docSnap.exists()) {
        // Si ya existen desafíos para este día, cargarlos
        const data = docSnap.data();
        setChallenges(data.challenges || []);
        
        // Calcular estadísticas
        const completed = data.challenges.filter(c => c.status === 'completed').length;
        const totalXP = data.challenges
          .filter(c => c.status === 'completed')
          .reduce((acc, curr) => acc + curr.xpReward, 0);
          
        setStats({
          completed,
          total: data.challenges.length,
          totalXP
        });
        setLoading(false);
      } else {
        // Si es el día actual y no existen, generarlos
        const today = new Date().toISOString().split('T')[0];
        if (targetDate === today) {
          const newChallenges = generateDailyChallenges();
          try {
            await setDoc(challengesRef, {
              date: targetDate,
              challenges: newChallenges,
              createdAt: new Date()
            });
            // El onSnapshot se disparará de nuevo con los datos creados
          } catch (error) {
            console.error("Error generating daily challenges:", error);
            setLoading(false);
          }
        } else {
          // Si es una fecha pasada/futura y no hay datos
          setChallenges([]);
          setStats({ completed: 0, total: 0, totalXP: 0 });
          setLoading(false);
        }
      }
    }, (error) => {
      console.error("Error fetching daily challenges:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, targetDate]);

  /**
   * Marca un desafío como completado y otorga recompensas
   */
  const completeChallenge = async (challengeId) => {
    if (!user?.uid || !challenges.length) return;

    const challengeIndex = challenges.findIndex(c => c.id === challengeId);
    if (challengeIndex === -1) return;

    const challenge = challenges[challengeIndex];
    if (challenge.status === 'completed') return; // Ya completado

    const updatedChallenges = [...challenges];
    updatedChallenges[challengeIndex] = {
      ...challenge,
      status: 'completed',
      progress: challenge.target,
      completedAt: new Date().toISOString()
    };

    try {
      // 1. Actualizar el documento de desafíos diarios
      const challengesRef = doc(db, 'users', user.uid, 'dailyChallenges', targetDate);
      await updateDoc(challengesRef, {
        challenges: updatedChallenges
      });

      // 2. Otorgar recompensas al usuario (XP y Monedas)
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        totalXP: increment(challenge.xpReward),
        coins: increment(challenge.coinsReward),
        // Opcional: Incrementar contador de desafíos completados global
        totalChallengesCompleted: increment(1)
      });

      // 3. Verificar si completó todos los del día para bonus (opcional)
      const allCompleted = updatedChallenges.every(c => c.status === 'completed');
      if (allCompleted) {
        // Dar bonus extra
        await updateDoc(userRef, {
          totalXP: increment(100), // Bonus de 100 XP
          coins: increment(50)     // Bonus de 50 monedas
        });
      }

    } catch (error) {
      console.error("Error completing challenge:", error);
    }
  };

  /**
   * Actualiza el progreso de un desafío (sin completarlo aún)
   */
  const updateChallengeProgress = async (challengeId, newProgress) => {
    // Implementación similar a completeChallenge pero solo actualiza 'progress'
    // y verifica si newProgress >= target para llamar a completeChallenge
  };

  return {
    challenges,
    loading,
    stats,
    completeChallenge,
    updateChallengeProgress
  };
};
