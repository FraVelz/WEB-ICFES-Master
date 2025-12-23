import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useGamificationFirestore } from '@/features/logros/hooks/useGamificationFirestore';

/**
 * Hook unificado para gestionar perfiles de usuario (propio y público).
 * @param {string} [targetUserId] - ID del usuario a consultar. Si es null, usa el usuario autenticado.
 */
export const useUserProfile = (targetUserId = null) => {
  const { user: authUser } = useAuth();
  
  // Determinar qué ID usar: el pasado por prop o el del usuario logueado
  const uid = targetUserId || authUser?.uid;
  const isOwnProfile = authUser?.uid && uid === authUser.uid;

  // Hook de gamificación (ya soporta userId)
  const gamification = useGamificationFirestore(uid);
  
  const [profileData, setProfileData] = useState({
    photoUrl: null,
    name: '',
    personalPhrase: '',
    createdAt: null,
    coursesProgress: {},
    loading: true,
    exists: false
  });

  useEffect(() => {
    if (!uid) {
      setProfileData(prev => ({ ...prev, loading: false, exists: false }));
      return;
    }

    setProfileData(prev => ({ ...prev, loading: true }));

    const unsubscribe = onSnapshot(doc(db, 'users', uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Formatear fecha de creación
        let memberSince = 'Reciente';
        if (data.createdAt) {
          // Manejar Timestamp de Firestore o Date string
          const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          memberSince = date.toLocaleDateString('es-CO', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        } else if (isOwnProfile && authUser?.metadata?.creationTime) {
          // Fallback solo para perfil propio usando metadata de Auth
          const date = new Date(authUser.metadata.creationTime);
          memberSince = date.toLocaleDateString('es-CO', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }

        setProfileData({
          photoUrl: data.photoUrl || data.profileImage || (isOwnProfile ? authUser.photoURL : null),
          name: data.displayName || data.username || (isOwnProfile ? authUser.displayName : 'Usuario'),
          personalPhrase: data.personalPhrase || data.bio || '¡Preparándome para el éxito!',
          createdAt: memberSince,
          coursesProgress: data.coursesProgress || {},
          loading: false,
          exists: true
        });
      } else {
        // Si el documento no existe en Firestore
        if (isOwnProfile) {
          // Para perfil propio, mostramos datos de Auth como fallback
          setProfileData({
            photoUrl: authUser.photoURL,
            name: authUser.displayName || 'Estudiante',
            personalPhrase: '¡Preparándome para el éxito!',
            createdAt: new Date().toLocaleDateString('es-CO'),
            coursesProgress: {},
            loading: false,
            exists: true
          });
        } else {
          // Para perfil público, si no hay doc, no existe el usuario (o es privado/error)
          setProfileData(prev => ({ ...prev, loading: false, exists: false }));
        }
      }
    }, (error) => {
      console.error("Error fetching user profile:", error);
      setProfileData(prev => ({ ...prev, loading: false, exists: false }));
    });

    return () => unsubscribe();
  }, [uid, authUser, isOwnProfile]);

  // Calcular progreso para el siguiente nivel
  const xpForNextLevel = gamification.level * 1000;
  const xpProgress = xpForNextLevel > 0 
    ? Math.min(100, (gamification.totalXP / xpForNextLevel) * 100) 
    : 0;

  return {
    uid,
    isOwnProfile,
    ...profileData,
    ...gamification, // achievements, level, totalXP, coins, streak
    xpForNextLevel,
    xpProgress
  };
};
