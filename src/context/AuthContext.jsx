import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import UserFirestoreService from '@/features/user/services/UserFirestoreService';
import ProgressFirestoreService from '@/features/progress/services/ProgressFirestoreService';
import GamificationFirestoreService from '@/features/logros/services/GamificationFirestoreService';
import SubscriptionPlanService from '@/features/store/services/SubscriptionPlanService';

// Crear contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monitorear cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Registro de usuario
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      // Crear usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil con nombre
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      // Crear perfil de usuario en Firestore usando el servicio
      await UserFirestoreService.createUserProfile(userCredential.user.uid, {
        email,
        displayName
      });

      // Crear registros iniciales de progreso y gamificación
      await ProgressFirestoreService.updateProgress(userCredential.user.uid, {
        totalAttempts: 0,
        totalCorrect: 0,
        percentage: 0,
        streakDays: 0
      });

      await GamificationFirestoreService.createGamificationProfile(userCredential.user.uid);

      // Crear plan gratuito por defecto
      await SubscriptionPlanService.createDefaultPlan(userCredential.user.uid);

      return userCredential.user;
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  };

  // Login de usuario
  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  };

  // Login con Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Verificar si el usuario es nuevo usando el servicio
      const userExists = await UserFirestoreService.userExists(userCredential.user.uid);
      
      // Si es nuevo, crear datos iniciales en Firestore
      if (!userExists) {
        // Asegurar que el perfil de Firebase Auth tenga la foto de Google
        if (!userCredential.user.photoURL) {
          await updateProfile(userCredential.user, {
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL
          });
        }

        await UserFirestoreService.createUserProfile(userCredential.user.uid, {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL
        });

        // Crear registros iniciales de progreso y gamificación
        await ProgressFirestoreService.updateProgress(userCredential.user.uid, {
          totalAttempts: 0,
          totalCorrect: 0,
          percentage: 0,
          streakDays: 0
        });

        await GamificationFirestoreService.createGamificationProfile(userCredential.user.uid);

        // Crear plan gratuito por defecto
        await SubscriptionPlanService.createDefaultPlan(userCredential.user.uid);
      }
      
      return userCredential.user;
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Verificar si el email existe en Firestore
  const verifyEmailExists = async (email) => {
    try {
      const userExists = await UserFirestoreService.userExistsByEmail(email);
      return userExists;
    } catch (err) {
      console.error('Error verificando email:', err);
      return false;
    }
  };

  // Recuperar contraseña
  const resetPassword = async (email) => {
    try {
      setError(null);
      // handleCodeInApp: true hace que Firebase pase el código en la URL
      // en lugar de ir a Firebase Console, irá directamente a tu app
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      return true;
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw err;
    }
  };

  // Obtener datos del usuario desde Firestore usando servicios
  const getUserData = async (uid) => {
    try {
      const profile = await UserFirestoreService.getUserProfile(uid);
      const progress = await ProgressFirestoreService.getProgress(uid);
      const gamification = await GamificationFirestoreService.getProfile(uid);

      return {
        profile,
        progress,
        gamification
      };
    } catch (err) {
      console.error('Error al obtener datos del usuario:', err);
      return null;
    }
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    verifyEmailExists,
    getUserData,
    isAuthenticated: !!user,
    getUserPlan: SubscriptionPlanService.getUserPlan,
    updateUserPlan: SubscriptionPlanService.updateUserPlan,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Función auxiliar para mensajes de error en español
const getErrorMessage = (errorCode) => {
  const errors = {
    'auth/email-already-in-use': 'Este email ya está registrado',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/invalid-email': 'Email inválido',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Email o contraseña incorrectos',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
  };

  return errors[errorCode] || 'Ocurrió un error. Intenta de nuevo';
};
