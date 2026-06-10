import { PerfilPublico } from '@/features/user/pages';
import { fetchPublicProfile } from '@/services/profile/publicProfileServer';
import {
  buildPublicProfileViewState,
  PUBLIC_PROFILE_UUID_REGEX,
  type PublicProfileErrorCode,
} from '@/services/profile/publicProfileView';

type PageProps = {
  searchParams: Promise<{ userId?: string }>;
};

export default async function PublicProfilePage({ searchParams }: PageProps) {
  const { userId: rawUserId } = await searchParams;
  const userId = rawUserId?.trim() ?? null;

  let errorCode: PublicProfileErrorCode = null;
  let payload = null;

  if (!userId) {
    errorCode = 'invalid_id';
  } else if (!PUBLIC_PROFILE_UUID_REGEX.test(userId)) {
    errorCode = 'invalid_id';
  } else if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errorCode = 'unavailable';
  } else {
    try {
      payload = await fetchPublicProfile(userId);
      if (!payload) {
        errorCode = 'not_found';
      }
    } catch {
      errorCode = 'server';
    }
  }

  const view = buildPublicProfileViewState(userId, payload, errorCode);

  return <PerfilPublico view={view} />;
}

export function generateMetadata() {
  return {
    title: 'Perfil público',
  };
}
