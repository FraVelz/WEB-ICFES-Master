import { db } from '@/config/firebase';
import { collection, query, where, orderBy, getDocs, writeBatch, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { RANKS, getNextRank, getPrevRank } from '../constants/ranks';

const LEADERBOARD_CONFIG_DOC = 'system/leaderboard';

/**
 * Verifica si es necesario actualizar los rangos (Lunes 5:00 AM)
 */
export const checkAndProcessWeeklyUpdate = async () => {
  try {
    const configRef = doc(db, LEADERBOARD_CONFIG_DOC);
    const configSnap = await getDoc(configRef);
    
    const now = new Date();
    const lastUpdate = configSnap.exists() ? configSnap.data().lastUpdate?.toDate() : new Date(0);
    
    // Calcular el último lunes a las 5:00 AM
    const lastMonday = new Date(now);
    const day = lastMonday.getDay();
    const diff = lastMonday.getDate() - day + (day === 0 ? -6 : 1); // Ajustar al lunes
    lastMonday.setDate(diff);
    lastMonday.setHours(5, 0, 0, 0);

    // Si la última actualización fue antes del último lunes a las 5 AM, actualizar
    if (lastUpdate < lastMonday) {
      console.log('Iniciando actualización semanal de rangos...');
      await processWeeklyRanking();
      
      // Actualizar fecha de última ejecución
      await setDoc(configRef, { lastUpdate: serverTimestamp() }, { merge: true });
      console.log('Actualización semanal completada.');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error en checkAndProcessWeeklyUpdate:', error);
    return false;
  }
};

/**
 * Procesa la lógica de ascenso y descenso
 */
const processWeeklyRanking = async () => {
  const batch = writeBatch(db);
  const usersRef = collection(db, 'users');
  
  // Procesar cada rango
  for (const rankKey in RANKS) {
    const rank = RANKS[rankKey];
    
    // Obtener usuarios de este rango ordenados por XP semanal
    const q = query(
      usersRef, 
      where('rank', '==', rank.id),
      orderBy('weeklyXP', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    
    const totalUsers = users.length;
    
    users.forEach((user, index) => {
      const position = index + 1;
      const userRef = doc(db, 'users', user.id);
      let newRank = rank.id;
      let status = 'stable'; // promoted, demoted, stable

      // Lógica de Ascenso
      if (rank.promoteCount > 0 && position <= rank.promoteCount) {
        const nextRank = getNextRank(rank.id);
        if (nextRank) {
          newRank = nextRank.id;
          status = 'promoted';
        }
      }
      // Lógica de Descenso
      else if (rank.demoteCount > 0 && position > (totalUsers - rank.demoteCount)) {
        const prevRank = getPrevRank(rank.id);
        if (prevRank) {
          newRank = prevRank.id;
          status = 'demoted';
        }
      }

      // Actualizar usuario: Nuevo rango, resetear XP semanal, guardar historial
      batch.update(userRef, {
        rank: newRank,
        weeklyXP: 0, // Resetear XP semanal
        lastWeekStatus: status,
        lastWeekPosition: position,
        lastWeekRank: rank.id
      });
    });
  }

  await batch.commit();
};
