import profileNeutral from '@/assets/avatars/profile-neutral.svg';

/** Avatar por defecto cuando el usuario no tiene foto (local, sin API externa). */
export const DEFAULT_PROFILE_AVATAR = profileNeutral.src;

export function resolveProfileAvatarSrc(profileImage: string | null | undefined, _seed?: string): string {
  return profileImage?.trim() ? profileImage : DEFAULT_PROFILE_AVATAR;
}
