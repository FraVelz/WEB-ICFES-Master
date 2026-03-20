// Utilidades para gestionar datos del usuario (localStorage)
// Preparado para futura implementación de backend
import {
  encryptData,
  decryptData,
  createChecksum,
  verifyChecksum,
} from './dataEncryption';

const STORAGE_KEYS = {
  USER_PROFILE: 'icfes_user_profile',
  USER_SETTINGS: 'icfes_user_settings',
};

// Sistema de rangos basado en porcentaje de desempeño
const RANK_SYSTEM = {
  0: {
    name: 'Novato',
    icon: '🥚',
    color: 'from-gray-400 to-gray-600',
    minScore: 0,
  },
  1: {
    name: 'Aprendiz',
    icon: '📚',
    color: 'from-blue-400 to-blue-600',
    minScore: 40,
  },
  2: {
    name: 'Estudiante',
    icon: '📖',
    color: 'from-cyan-400 to-cyan-600',
    minScore: 55,
  },
  3: {
    name: 'Profesional',
    icon: '💼',
    color: 'from-green-400 to-green-600',
    minScore: 70,
  },
  4: {
    name: 'Experto',
    icon: '🎓',
    color: 'from-purple-400 to-purple-600',
    minScore: 80,
  },
  5: {
    name: 'Maestro',
    icon: '👑',
    color: 'from-yellow-400 to-yellow-600',
    minScore: 90,
  },
};

/**
 * Obtiene el perfil del usuario o crea uno por defecto
 */
export const getUserProfile = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return stored ? JSON.parse(stored) : getDefaultProfile();
};

/**
 * Perfil de usuario por defecto
 */
export const getDefaultProfile = () => {
  return {
    id: Date.now(),
    username: 'Usuario ICFES',
    bio: 'Estudiante en busca de conocimiento',
    profileImage: null, // Base64 o URL
    virtualMoney: 1000, // Moneda virtual inicial
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Actualiza el perfil del usuario
 */
export const updateUserProfile = (profileData) => {
  const profile = {
    ...getUserProfile(),
    ...profileData,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  return profile;
};

/**
 * Obtiene el rango del usuario basado en su desempeño
 */
export const getUserRank = () => {
  try {
    const progress = JSON.parse(localStorage.getItem('icfes_progress'));
    const percentage = progress ? progress.percentage : 0;

    // Encontrar el rango apropiado
    let currentRank = RANK_SYSTEM[0];
    let rankIndex = 0;
    for (let i = 5; i >= 0; i--) {
      if (percentage >= RANK_SYSTEM[i].minScore) {
        currentRank = RANK_SYSTEM[i];
        rankIndex = i;
        break;
      }
    }

    return {
      ...currentRank,
      percentage,
      nextRankPercentage:
        rankIndex < 5 ? RANK_SYSTEM[rankIndex + 1].minScore : null,
    };
  } catch {
    return {
      ...RANK_SYSTEM[0],
      percentage: 0,
      nextRankPercentage: RANK_SYSTEM[1].minScore,
    };
  }
};

/**
 * Actualiza el nombre de usuario (localStorage)
 */
export const updateUsername = async (username) => {
  if (!username || username.trim().length === 0) {
    throw new Error('El nombre de usuario no puede estar vacío');
  }
  if (username.length > 30) {
    throw new Error('El nombre de usuario no puede exceder 30 caracteres');
  }
  return updateUserProfile({ username: username.trim() });
};

/**
 * Actualiza la biografía del usuario (localStorage)
 */
export const updateUserBio = async (bio) => {
  if (bio && bio.length > 150) {
    throw new Error('La biografía no puede exceder 150 caracteres');
  }
  return updateUserProfile({ bio: bio?.trim() || '' });
};

/**
 * Actualiza la foto de perfil (base64 en localStorage)
 */
export const updateProfileImage = async (file) => {
  if (!file) {
    return updateUserProfile({ profileImage: null });
  }
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen');
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('La imagen no puede exceder 2MB');
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = updateUserProfile({ profileImage: reader.result });
      resolve(result);
    };
    reader.onerror = () => reject(new Error('Error al leer la imagen'));
    reader.readAsDataURL(file);
  });
};

/**
 * Borra toda la información del usuario y su progreso
 */
export const deleteUserAccount = () => {
  const confirmed = window.confirm(
    '⚠️ ¿Estás seguro? Esta acción no se puede deshacer.\n\n' +
      'Se borrará:\n' +
      '- Tu perfil y configuraciones\n' +
      '- Todo tu progreso\n' +
      '- Todos los exámenes y prácticas realizadas'
  );

  if (!confirmed) {
    return false;
  }

  const finalConfirm = window.confirm(
    '🚨 ÚLTIMA CONFIRMACIÓN\n\n' +
      'Escriba "BORRAR TODO" para confirmar la eliminación permanente.'
  );

  if (!finalConfirm) {
    return false;
  }

  const userInput = prompt('Escribe "BORRAR TODO" para confirmar:');

  if (userInput === 'BORRAR TODO') {
    // Borrar todos los datos
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
    localStorage.removeItem('icfes_exams');
    localStorage.removeItem('icfes_practice');
    localStorage.removeItem('icfes_progress');

    return true;
  }

  return false;
};

/**
 * Obtiene los ajustes del usuario
 */
export const getUserSettings = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
  return stored ? JSON.parse(stored) : getDefaultSettings();
};

/**
 * Ajustes por defecto
 */
export const getDefaultSettings = () => {
  return {
    language: 'es',
    theme: 'dark',
    notifications: true,
    soundEnabled: false,
    privacyLevel: 'private', // private, friends, public
  };
};

/**
 * Actualiza los ajustes del usuario
 */
export const updateUserSettings = (settingsData) => {
  const settings = {
    ...getUserSettings(),
    ...settingsData,
  };
  localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
  return settings;
};

/**
 * Obtiene información completa del usuario
 */
export const getCompleteUserData = () => {
  const profile = getUserProfile();
  const rank = getUserRank();
  const settings = getUserSettings();

  try {
    const progress = JSON.parse(localStorage.getItem('icfes_progress'));
    return {
      profile,
      rank,
      settings,
      progress,
      joinedDate: new Date(profile.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  } catch {
    return {
      profile,
      rank,
      settings,
      progress: null,
      joinedDate: new Date(profile.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  }
};

/**
 * Exporta datos del usuario a JSON
 */
export const exportUserData = async (password) => {
  if (!password) {
    throw new Error('Se requiere una contraseña para exportar datos');
  }

  const userData = {
    profile: getUserProfile(),
    settings: getUserSettings(),
    exams: JSON.parse(localStorage.getItem('icfes_exams') || '[]'),
    practices: JSON.parse(localStorage.getItem('icfes_practice') || '[]'),
    progress: JSON.parse(localStorage.getItem('icfes_progress') || 'null'),
    exportedAt: new Date().toISOString(),
  };

  // Crear checksum para validar integridad
  const checksum = await createChecksum(userData);

  // Cifrar datos
  const encryptedData = await encryptData(userData, password);

  // Crear objeto de exportación
  const exportObject = {
    version: '1.0',
    encrypted: true,
    checksum: checksum,
    data: encryptedData,
    exportedAt: new Date().toISOString(),
  };

  const json = JSON.stringify(exportObject, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `perfil-usuario-${getUserProfile().username.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.icfes`;
  a.click();

  URL.revokeObjectURL(url);
};

/**
 * Importa datos de usuario desde un archivo exportado
 * @param {File} file - Archivo JSON exportado
 * @param {string} password - Contraseña para descifrar
 * @returns {Promise<object>} - Datos importados
 */
export const importUserData = async (file, password) => {
  if (!password) {
    throw new Error('Se requiere una contraseña para importar datos');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const fileContent = e.target.result;
        const exportObject = JSON.parse(fileContent);

        // Validar estructura del archivo
        if (!exportObject.encrypted || !exportObject.data) {
          throw new Error('Formato de archivo inválido o no cifrado');
        }

        if (exportObject.version !== '1.0') {
          throw new Error('Versión de archivo no soportada');
        }

        // Descifrar datos
        const decryptedData = await decryptData(exportObject.data, password);

        // Validar checksum
        const isValid = await verifyChecksum(
          decryptedData,
          exportObject.checksum
        );
        if (!isValid) {
          throw new Error('Los datos han sido modificados o están corruptos');
        }

        // Guardar datos en localStorage
        if (decryptedData.profile) {
          localStorage.setItem(
            STORAGE_KEYS.USER_PROFILE,
            JSON.stringify(decryptedData.profile)
          );
        }
        if (decryptedData.settings) {
          localStorage.setItem(
            STORAGE_KEYS.USER_SETTINGS,
            JSON.stringify(decryptedData.settings)
          );
        }
        if (decryptedData.exams) {
          localStorage.setItem(
            'icfes_exams',
            JSON.stringify(decryptedData.exams)
          );
        }
        if (decryptedData.practices) {
          localStorage.setItem(
            'icfes_practice',
            JSON.stringify(decryptedData.practices)
          );
        }
        if (decryptedData.progress) {
          localStorage.setItem(
            'icfes_progress',
            JSON.stringify(decryptedData.progress)
          );
        }

        resolve(decryptedData);
      } catch (error) {
        reject(new Error(`Error al importar datos: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsText(file);
  });
};

/**
 * Retorna todos los rangos disponibles
 */
export const getAllRanks = () => {
  return Object.values(RANK_SYSTEM);
};

/**
 * Obtiene el dinero virtual del usuario
 */
export const getVirtualMoney = () => {
  const profile = getUserProfile();
  return profile.virtualMoney || 0;
};

/**
 * Suma dinero virtual al usuario
 */
export const addVirtualMoney = (amount) => {
  if (amount < 0) {
    throw new Error('No se puede añadir una cantidad negativa');
  }

  const profile = getUserProfile();
  const newAmount = (profile.virtualMoney || 0) + amount;
  return updateUserProfile({ virtualMoney: newAmount });
};

/**
 * Resta dinero virtual del usuario
 */
export const removeVirtualMoney = (amount) => {
  if (amount < 0) {
    throw new Error('No se puede restar una cantidad negativa');
  }

  const profile = getUserProfile();
  const currentMoney = profile.virtualMoney || 0;

  if (currentMoney < amount) {
    throw new Error('No tienes suficiente dinero virtual');
  }

  const newAmount = currentMoney - amount;
  return updateUserProfile({ virtualMoney: newAmount });
};

/**
 * Obtiene dinero bonus por completar un examen
 */
export const getExamReward = (correctAnswers, totalQuestions) => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  let reward = 0;

  if (percentage >= 90) reward = 500;
  else if (percentage >= 80) reward = 400;
  else if (percentage >= 70) reward = 300;
  else if (percentage >= 60) reward = 200;
  else if (percentage >= 50) reward = 100;
  else reward = 50;

  return reward;
};
