/**
 * useGamification - Hook para acceder a gamificación
 * 
 * USO:
 * const { level, coins, badges, addXP, unlockBadge } = useGamification(userId);
 */

import { useState, useEffect, useCallback } from 'react';
import { GamificationService } from '@/services';

export function useGamification(userId) {
  const [profile, setProfile] = useState(null);
  const [level, setLevel] = useState(null);
  const [coins, setCoins] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadGamification = useCallback(async () => {
    try {
      setLoading(true);
      const [profileData, levelData, coinsData, badgesData] = await Promise.all([
        GamificationService.getProfile(userId),
        GamificationService.getLevel(userId),
        GamificationService.getCoinsInfo(userId),
        GamificationService.getBadges(userId)
      ]);
      setProfile(profileData);
      setLevel(levelData);
      setCoins(coinsData);
      setBadges(badgesData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando gamificación:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Cargar gamificación al montar o cuando cambia userId
  useEffect(() => {
    if (userId) {
      loadGamification();
    }
  }, [userId, loadGamification]);

  const addXP = async (points, reason = 'actividad') => {
    try {
      const updated = await GamificationService.addXP(userId, points, reason);
      setProfile(updated);

      // Actualizar nivel si cambió
      const levelData = await GamificationService.getLevel(userId);
      setLevel(levelData);

      // Mostrar notificación si subió de nivel
      if (updated.levelUpNotification) {
        setNotification(updated.levelUpNotification);
        setTimeout(() => setNotification(null), 3000);
      }

      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addCoins = async (amount, reason = 'recompensa') => {
    try {
      const updated = await GamificationService.addCoins(userId, amount, reason);
      setProfile(updated);
      const coinsData = await GamificationService.getCoinsInfo(userId);
      setCoins(coinsData);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const spendCoins = async (amount, item = 'item') => {
    try {
      const updated = await GamificationService.spendCoins(userId, amount, item);
      setProfile(updated);
      const coinsData = await GamificationService.getCoinsInfo(userId);
      setCoins(coinsData);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const unlockBadge = async (badgeId) => {
    try {
      const updated = await GamificationService.unlockBadge(userId, badgeId);
      setProfile(updated);
      const badgesData = await GamificationService.getBadges(userId);
      setBadges(badgesData);

      // Mostrar notificación de badge desbloqueado
      const badge = GamificationService.BADGES[badgeId];
      setNotification({
        type: 'badge',
        message: `¡Badge desbloqueado! ${badge.name}`,
        icon: badge.icon
      });
      setTimeout(() => setNotification(null), 3000);

      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const checkAndUnlockAchievements = async (context = {}) => {
    try {
      const unlockedBadges = await GamificationService.checkAndUnlockAchievements(userId, context);
      
      if (unlockedBadges.length > 0) {
        // Recargar badges
        const badgesData = await GamificationService.getBadges(userId);
        setBadges(badgesData);
      }

      return unlockedBadges;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const reset = async () => {
    try {
      await GamificationService.reset(userId);
      await loadGamification();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    profile,
    level,
    coins,
    badges,
    notification,
    loading,
    error,
    addXP,
    addCoins,
    spendCoins,
    unlockBadge,
    checkAndUnlockAchievements,
    reset,
    reload: loadGamification
  };
}

export default useGamification;
