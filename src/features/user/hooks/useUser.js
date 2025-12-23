import { useState, useEffect } from 'react';
import { getUserProfile, getUserRank, getVirtualMoney, addVirtualMoney, removeVirtualMoney } from '@/shared/utils/userProfile';
import { useAuth } from '@/context/AuthContext';
import UserFirestoreService from '@/features/user/services/UserFirestoreService';

/**
 * Hook personalizado para manejar datos del usuario
 */
export const useUser = () => {
  const [user, setUser] = useState(null);
  const [rank, setRank] = useState(null);
  const [virtualMoney, setVirtualMoney] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        let profile = getUserProfile();
        
        // Si estamos autenticados, intentar obtener datos de Firestore
        if (authUser?.uid) {
          try {
            const firestoreProfile = await UserFirestoreService.getUserProfile(authUser.uid);
            
            // Prioridad de imagen de perfil:
            // 1. Imagen subida a Firebase Storage (profileImage)
            // 2. Imagen de Google (photoURL) - si no hay en Firebase
            let photoURL = firestoreProfile.profileImage || firestoreProfile.photoURL;
            
            // Si no hay imagen en Firebase pero hay en Google, sincronizar
            if (!firestoreProfile.profileImage && authUser?.photoURL && !firestoreProfile.googleImageSynced) {
              photoURL = authUser.photoURL;
              // Marcar como sincronizado
              await UserFirestoreService.updateUserProfile(authUser.uid, {
                photoURL: authUser.photoURL,
                googleImageSynced: true
              });
            }
            
            // Fusionar datos de Firestore con los locales, dando prioridad a Firestore
            profile = {
              ...profile,
              displayName: firestoreProfile.displayName || profile.username,
              username: firestoreProfile.displayName || profile.username,
              profileImage: photoURL || profile.profileImage,
              bio: firestoreProfile.bio || profile.bio,
              virtualMoney: firestoreProfile.virtualMoney || profile.virtualMoney
            };
            
            // Actualizar localStorage con la data de Firebase
            const { updateUserProfile: updateProfileInStorage } = await import('@/shared/utils/userProfile');
            updateProfileInStorage(profile);
          } catch (err) {
            console.warn('Error cargando datos de Firestore, usando localStorage:', err);
          }
        }
        
        const userRank = getUserRank();
        const money = getVirtualMoney();
        
        setUser(profile);
        setRank(userRank);
        setVirtualMoney(money);
        setIsLoading(false);
      } catch (err) {
        console.error('Error cargando datos del usuario:', err);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [authUser?.uid, authUser?.photoURL]);

  const refreshUser = () => {
    const profile = getUserProfile();
    const userRank = getUserRank();
    const money = getVirtualMoney();
    setUser(profile);
    setRank(userRank);
    setVirtualMoney(money);
  };

  const addMoney = (amount) => {
    try {
      addVirtualMoney(amount);
      setVirtualMoney(getVirtualMoney());
      return true;
    } catch (error) {
      console.error('Error al añadir dinero:', error);
      return false;
    }
  };

  const removeMoney = (amount) => {
    try {
      removeVirtualMoney(amount);
      setVirtualMoney(getVirtualMoney());
      return true;
    } catch (error) {
      console.error('Error al restar dinero:', error);
      return false;
    }
  };

  return {
    user,
    rank,
    virtualMoney,
    isLoading,
    refreshUser,
    addMoney,
    removeMoney
  };
};
