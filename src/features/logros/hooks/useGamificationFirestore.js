import { useState, useEffect } from 'react';
import { db } from '@/config/firebase';
import { collection, doc, onSnapshot, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { ACHIEVEMENTS_DATA } from '../constants/achievements';

export const useGamificationFirestore = (userId) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // User Stats
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState([]); // Array of date strings YYYY-MM-DD
  
  // Derived state
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [completedCount, setCompletedCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  // Helper: Get local date string YYYY-MM-DD
  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper: Calculate current streak
  const calculateStreak = (dates) => {
    if (!dates || dates.length === 0) {
      setCurrentStreak(0);
      return;
    }

    // Sort dates descending
    const sortedDates = [...dates].sort((a, b) => new Date(b) - new Date(a));
    const uniqueDates = [...new Set(sortedDates)]; // Remove duplicates

    const today = getLocalDateString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getLocalDateString(yesterdayDate);

    // Check if streak is active (has today or yesterday)
    if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday)) {
      setCurrentStreak(0);
      return;
    }

    let count = 0;
    let currentDate = new Date();
    
    // If today is not in list, start checking from yesterday
    if (!uniqueDates.includes(today)) {
        currentDate.setDate(currentDate.getDate() - 1);
    }

    // Iterate backwards to count consecutive days
    while (true) {
        const dateStr = getLocalDateString(currentDate);
        if (uniqueDates.includes(dateStr)) {
            count++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    setCurrentStreak(count);
  };

  useEffect(() => {
    if (!userId) {
      setAchievements([]);
      setCoins(0);
      setStreak([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Listen to Achievements
    const unsubscribeAchievements = onSnapshot(collection(db, 'users', userId, 'achievements'), (snapshot) => {
      const userProgress = {};
      snapshot.forEach(doc => {
        userProgress[doc.id] = doc.data();
      });

      let calculatedXP = 0;
      let completed = 0;

      const mergedAchievements = ACHIEVEMENTS_DATA.map(achievement => {
        const progressData = userProgress[achievement.id] || {};
        const current = progressData.current || 0;
        const isUnlocked = progressData.unlocked || false;
        
        if (isUnlocked) {
          calculatedXP += achievement.xpReward;
          completed++;
        }

        let status = 'incomplete';
        if (isUnlocked) status = 'completed';
        else if (current > 0) status = 'in_progress';

        return {
          ...achievement,
          progress: current,
          unlockedAt: progressData.unlockedAt ? progressData.unlockedAt.toDate() : null,
          status
        };
      });

      setAchievements(mergedAchievements);
      setTotalXP(calculatedXP);
      setCompletedCount(completed);
      setLevel(Math.floor(calculatedXP / 1000) + 1);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to achievements:", error);
      setLoading(false);
    });

    // 2. Listen to User Document (Coins, Streak)
    const unsubscribeUser = onSnapshot(doc(db, 'users', userId), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Read 'virtualMoney' field as requested
            setCoins(data.virtualMoney || 0);
            const streakData = data.streak || [];
            setStreak(streakData);
            setLongestStreak(data.longestStreak || 0);
            calculateStreak(streakData);
        }
        // Removed automatic document creation to avoid overwriting existing data
    });

    return () => {
        unsubscribeAchievements();
        unsubscribeUser();
    };
  }, [userId]);

  // 3. Update Streak on Mount
  useEffect(() => {
      const updateDailyStreak = async () => {
          if (!userId) return;
          
          const today = getLocalDateString();
          
          try {
              const userRef = doc(db, 'users', userId);
              await updateDoc(userRef, {
                  streak: arrayUnion(today),
                  lastLogin: serverTimestamp()
              });
          } catch (error) {
              console.error("Error updating streak:", error);
          }
      };

      if (userId) {
          updateDailyStreak();
      }
  }, [userId]);

  // 4. Update Longest Streak if Current Streak is higher
  useEffect(() => {
    if (userId && currentStreak > longestStreak) {
        const updateLongestStreak = async () => {
            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    longestStreak: currentStreak
                });
            } catch (error) {
                console.error("Error updating longest streak:", error);
            }
        };
        updateLongestStreak();
    }
  }, [currentStreak, longestStreak, userId]);

  const updateAchievementProgress = async (achievementId, amount = 1) => {
    if (!userId) return;
    
    const achievement = ACHIEVEMENTS_DATA.find(a => a.id === achievementId);
    if (!achievement) return;

    const achievementRef = doc(db, 'users', userId, 'achievements', achievementId);
    
    try {
      const docSnap = await getDoc(achievementRef);
      const currentData = docSnap.exists() ? docSnap.data() : { current: 0, unlocked: false };

      if (currentData.unlocked) return;

      const newCurrent = (currentData.current || 0) + amount;
      const unlocked = newCurrent >= achievement.target;

      const updateData = {
        current: newCurrent,
        lastUpdated: serverTimestamp()
      };

      if (unlocked) {
        updateData.unlocked = true;
        updateData.unlockedAt = serverTimestamp();
        
        // Award XP and Coins
        const userRef = doc(db, 'users', userId);
        // Update 'coins' field
        await updateDoc(userRef, {
            coins: (coins || 0) + (achievement.coinsReward || 0)
        });
      }

      await setDoc(achievementRef, updateData, { merge: true });
      
    } catch (error) {
      console.error("Error updating achievement:", error);
    }
  };

  return {
    achievements,
    loading,
    totalXP,
    level,
    completedCount,
    updateAchievementProgress,
    coins,
    streak,
    currentStreak,
    longestStreak
  };
};
