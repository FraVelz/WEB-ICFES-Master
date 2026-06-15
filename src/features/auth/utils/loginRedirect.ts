import { resolvePostAuthEntryPath } from '@/services/persistence/skillLevelPersistence';

export async function redirectAfterAuth(userId: string, navigate: (path: string) => void): Promise<void> {
  navigate(await resolvePostAuthEntryPath({ demoMode: false, userId }, userId));
}
