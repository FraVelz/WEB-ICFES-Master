import type { UserProfile } from '@/features/user/types/userProfile.types';
import { DEMO_USER_ID } from '@/services/demo/demoCoins';

export function getDemoProfile(): UserProfile {
  return {
    id: DEMO_USER_ID,
    username: 'Estudiante',
    displayName: 'Estudiante',
    email: null,
    bio: 'Modo demo — crea una cuenta para guardar tu progreso en la nube.',
    profileImage: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
