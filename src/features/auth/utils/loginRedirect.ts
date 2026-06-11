import { buildLevelAssessmentUrl } from '@/features/auth/constants/skillLevelRoutes';
import { resolveLevelAssessmentRedirect } from '@/services/persistence/skillLevelPersistence';

export async function redirectAfterAuth(userId: string, navigate: (path: string) => void): Promise<void> {
  const redirect =
    (await resolveLevelAssessmentRedirect({ demoMode: false, userId }, userId)) ?? buildLevelAssessmentUrl('account');
  navigate(redirect);
}
