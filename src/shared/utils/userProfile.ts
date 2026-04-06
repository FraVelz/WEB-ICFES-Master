// User profile helpers (localStorage)
// Ready for a future backend-backed implementation
import { encryptData, decryptData, createChecksum, verifyChecksum } from './dataEncryption';

const STORAGE_KEYS = {
  USER_PROFILE: 'icfes_user_profile',
  USER_SETTINGS: 'icfes_user_settings',
};

export interface UserProfile {
  id: number | string;
  username: string;
  displayName?: string;
  email?: string;
  bio?: string;
  profileImage?: string | null;
  virtualMoney?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  language: string;
  theme: string;
  notifications: boolean;
  soundEnabled: boolean;
  privacyLevel: string;
}

export interface RankInfo {
  name: string;
  icon: string;
  color: string;
  minScore: number;
}

// Rank tiers from overall performance percentage
const RANK_SYSTEM: Record<number, RankInfo> = {
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
 * Load user profile or create defaults
 */
export const getUserProfile = (): UserProfile => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return stored ? JSON.parse(stored) : getDefaultProfile();
};

/**
 * Default user profile
 */
export const getDefaultProfile = (): UserProfile => {
  return {
    id: Date.now(),
    username: 'Usuario ICFES',
    bio: 'Estudiante en busca de conocimiento',
    profileImage: null, // Base64 or URL
    virtualMoney: 1000, // Starting virtual currency
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Update user profile
 */
export const updateUserProfile = (profileData: Partial<UserProfile>): UserProfile => {
  const profile = {
    ...getUserProfile(),
    ...profileData,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  return profile;
};

export interface UserRank extends RankInfo {
  percentage: number;
  nextRankPercentage: number | null;
}

/**
 * Resolve rank from stored progress percentage
 */
export const getUserRank = (): UserRank => {
  try {
    const progress = JSON.parse(localStorage.getItem('icfes_progress') ?? 'null') as { percentage?: number } | null;
    const percentage = progress?.percentage ?? 0;

    // Pick matching tier
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
      nextRankPercentage: rankIndex < 5 ? RANK_SYSTEM[rankIndex + 1].minScore : null,
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
 * Update username (localStorage)
 */
export const updateUsername = async (username: string): Promise<UserProfile> => {
  if (!username || username.trim().length === 0) {
    throw new Error('El nombre de usuario no puede estar vacío');
  }
  if (username.length > 30) {
    throw new Error('El nombre de usuario no puede exceder 30 caracteres');
  }
  return updateUserProfile({ username: username.trim() });
};

/**
 * Update bio (localStorage)
 */
export const updateUserBio = async (bio: string | null): Promise<UserProfile> => {
  if (bio && bio.length > 150) {
    throw new Error('La biografía no puede exceder 150 caracteres');
  }
  return updateUserProfile({ bio: bio?.trim() || '' });
};

/**
 * Update profile photo (base64 in localStorage)
 */
export const updateProfileImage = async (file: File | null): Promise<UserProfile> => {
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
      const data = reader.result;
      const profileImage = typeof data === 'string' ? data : null;
      const result = updateUserProfile({ profileImage });
      resolve(result);
    };
    reader.onerror = () => reject(new Error('Error al leer la imagen'));
    reader.readAsDataURL(file);
  });
};

/**
 * Delete all user data and progress (interactive confirmations)
 */
export const deleteUserAccount = (): boolean => {
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
    '🚨 ÚLTIMA CONFIRMACIÓN\n\n' + 'Escriba "BORRAR TODO" para confirmar la eliminación permanente.'
  );

  if (!finalConfirm) {
    return false;
  }

  const userInput = prompt('Escribe "BORRAR TODO" para confirmar:');

  if (userInput === 'BORRAR TODO') {
    // Clear all stored data
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
 * Load user settings
 */
export const getUserSettings = (): UserSettings => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
  return stored ? JSON.parse(stored) : getDefaultSettings();
};

/**
 * Default settings
 */
export const getDefaultSettings = (): UserSettings => {
  return {
    language: 'es',
    theme: 'dark',
    notifications: true,
    soundEnabled: false,
    privacyLevel: 'private', // private, friends, public
  };
};

/**
 * Update user settings
 */
export const updateUserSettings = (settingsData: Partial<UserSettings>): UserSettings => {
  const settings = {
    ...getUserSettings(),
    ...settingsData,
  };
  localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
  return settings;
};

/**
 * Aggregate profile, rank, settings, and progress
 */
export const getCompleteUserData = () => {
  const profile = getUserProfile();
  const rank = getUserRank();
  const settings = getUserSettings();

  try {
    const progress = JSON.parse(localStorage.getItem('icfes_progress') ?? 'null');
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
 * Export user data to an encrypted JSON file
 */
export const exportUserData = async (password: string): Promise<void> => {
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

  // Checksum for integrity
  const checksum = await createChecksum(userData);

  // Encrypt payload
  const encryptedData = await encryptData(userData, password);

  // Export envelope
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

export interface ImportedUserData {
  profile?: unknown;
  settings?: unknown;
  exams?: unknown;
  practices?: unknown;
  progress?: unknown;
}

/**
 * Import user data from an exported file
 */
export const importUserData = async (file: File, password: string): Promise<ImportedUserData> => {
  if (!password) {
    throw new Error('Se requiere una contraseña para importar datos');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => {
      try {
        const fileContent = e.target?.result;
        if (typeof fileContent !== 'string') throw new Error('Archivo no legible');
        const exportObject = JSON.parse(fileContent) as {
          encrypted?: boolean;
          data?: unknown;
          version?: string;
          checksum?: string;
        };

        // Validate file envelope
        if (!exportObject.encrypted || !exportObject.data) {
          throw new Error('Formato de archivo inválido o no cifrado');
        }

        if (exportObject.version !== '1.0') {
          throw new Error('Versión de archivo no soportada');
        }

        // Decrypt payload
        const dataToDecrypt = exportObject.data;
        if (typeof dataToDecrypt !== 'string') throw new Error('Datos de exportación inválidos');
        const decryptedData = await decryptData(dataToDecrypt, password);

        // Verify checksum
        const checksum = exportObject.checksum;
        if (typeof checksum !== 'string') throw new Error('Checksum inválido');
        const isValid = await verifyChecksum(decryptedData, checksum);
        if (!isValid) {
          throw new Error('Los datos han sido modificados o están corruptos');
        }

        // Persist to localStorage
        if (decryptedData.profile) {
          localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(decryptedData.profile));
        }
        if (decryptedData.settings) {
          localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(decryptedData.settings));
        }
        if (decryptedData.exams) {
          localStorage.setItem('icfes_exams', JSON.stringify(decryptedData.exams));
        }
        if (decryptedData.practices) {
          localStorage.setItem('icfes_practice', JSON.stringify(decryptedData.practices));
        }
        if (decryptedData.progress) {
          localStorage.setItem('icfes_progress', JSON.stringify(decryptedData.progress));
        }

        resolve(decryptedData as ImportedUserData);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        reject(new Error(`Error al importar datos: ${msg}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsText(file);
  });
};

/**
 * All rank tiers (metadata)
 */
export const getAllRanks = (): RankInfo[] => {
  return Object.values(RANK_SYSTEM);
};

/**
 * Current virtual currency balance
 */
export const getVirtualMoney = (): number => {
  const profile = getUserProfile();
  return profile.virtualMoney || 0;
};

/**
 * Add virtual currency
 */
export const addVirtualMoney = (amount: number): UserProfile => {
  if (amount < 0) {
    throw new Error('No se puede añadir una cantidad negativa');
  }

  const profile = getUserProfile();
  const newAmount = (profile.virtualMoney || 0) + amount;
  return updateUserProfile({ virtualMoney: newAmount });
};

/**
 * Subtract virtual currency
 */
export const removeVirtualMoney = (amount: number): UserProfile => {
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
 * Bonus coins from exam score
 */
export const getExamReward = (correctAnswers: number, totalQuestions: number): number => {
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
