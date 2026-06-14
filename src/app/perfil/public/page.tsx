import type { Metadata } from 'next';
import { PerfilPublico } from '@/features/user/pages';
import { PerfilPublicoLeagueGate } from '@/features/user/pages/PerfilPublicoLeagueGate';
import { fetchPublicProfile } from '@/services/profile/publicProfileServer';
import { getSiteUrl } from '@/config/site';
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

  return (
    <PerfilPublicoLeagueGate>
      <PerfilPublico view={view} />
    </PerfilPublicoLeagueGate>
  );
}

const NOINDEX: Metadata['robots'] = { index: false, follow: false };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { userId: rawUserId } = await searchParams;
  const userId = rawUserId?.trim();

  if (!userId || !PUBLIC_PROFILE_UUID_REGEX.test(userId)) {
    return {
      title: 'Perfil público',
      description: 'Perfil público de un estudiante en ICFES Master.',
      robots: NOINDEX,
    };
  }

  try {
    const payload = await fetchPublicProfile(userId);
    if (!payload) {
      return { title: 'Perfil no encontrado', robots: NOINDEX };
    }

    const name = payload.profile.displayName ?? payload.profile.username ?? 'Estudiante';
    const description = `Perfil público de ${name} en ICFES Master.`;

    return {
      title: `${name} | Perfil ICFES Master`,
      description,
      robots: NOINDEX,
      openGraph: {
        title: `${name} | Perfil ICFES Master`,
        description,
        type: 'profile',
        url: `${getSiteUrl()}/perfil/public/?userId=${userId}`,
      },
      twitter: {
        card: 'summary',
        title: `${name} | Perfil ICFES Master`,
        description,
      },
    };
  } catch {
    return { title: 'Perfil público', robots: NOINDEX };
  }
}
