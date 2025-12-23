import { useState, useEffect, useRef } from 'react';
import { db } from '@/config/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { checkAndProcessWeeklyUpdate } from '../services/leaderboardService';
import { RANKS } from '../constants/ranks';

export const useLeaderboard = (currentRankId = 'novato') => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRankInfo, setUserRankInfo] = useState(null);
  
  // Ref para controlar la suscripción y evitar fugas de memoria
  const unsubscribeRef = useRef(null);

  // Verificar actualización semanal al montar
  useEffect(() => {
    checkAndProcessWeeklyUpdate();
  }, []);

  useEffect(() => {
    // Función para establecer la conexión
    const connectLeaderboard = () => {
      // Si ya hay datos, no mostramos loading para evitar parpadeos al reconectar
      setLoading(prev => prev === true); 
      setError(null);
      
      // Limpiar suscripción previa si existe
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      const q = query(
        collection(db, 'users'),
        where('rank', '==', currentRankId),
        orderBy('weeklyXP', 'desc'),
        limit(50)
      );

      unsubscribeRef.current = onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          weeklyXP: doc.data().weeklyXP || 0,
          rank: doc.data().rank || 'novato'
        }));
        
        setLeaderboardData(users);
        setLoading(false);
      }, (err) => {
        console.warn("Leaderboard connection warning:", err);
        // Solo mostramos error si no tenemos datos previos para no romper la UI por desconexiones temporales
        setLoading(false);
      });
    };

    // Manejar visibilidad de la pestaña para ahorrar recursos y evitar errores de timeout
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Desconectar cuando la pestaña no es visible
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      } else {
        // Reconectar al volver
        connectLeaderboard();
      }
    };

    // Conexión inicial
    connectLeaderboard();
    
    // Escuchar cambios de visibilidad
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentRankId]);

  return { leaderboardData, loading, error };
};
