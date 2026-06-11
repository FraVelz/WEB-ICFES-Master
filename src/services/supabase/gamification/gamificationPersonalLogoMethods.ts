import { MAX_PERSONAL_LOGOS, type PersonalLogo } from '@/features/user/types/personalLogo.types';
import { ensureSupabase, GAMIFICATION_TABLE, mapFromDb } from './gamificationMappers';
import { getOrCreate } from './gamificationProfileMethods';
import { saveShopInventory } from './gamificationShopMethods';

export async function getPersonalLogos(userId: string): Promise<PersonalLogo[]> {
  const profile = await getOrCreate(userId);
  return profile.personalLogos ?? [];
}

export async function savePersonalLogos(userId: string, logos: PersonalLogo[]): Promise<PersonalLogo[]> {
  await getOrCreate(userId);
  const sb = ensureSupabase();
  const { data, error } = await sb
    .from(GAMIFICATION_TABLE)
    .update({
      personal_logos: logos.slice(0, MAX_PERSONAL_LOGOS),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(`Error guardando logos personales: ${error.message}`);
  return mapFromDb(data as Record<string, unknown>)!.personalLogos;
}

export async function addPersonalLogo(userId: string, logo: PersonalLogo): Promise<PersonalLogo[]> {
  const current = await getPersonalLogos(userId);
  if (current.length >= MAX_PERSONAL_LOGOS) {
    throw new Error(`Solo puedes guardar hasta ${MAX_PERSONAL_LOGOS} logos personales`);
  }
  if (current.some((entry) => entry.image === logo.image)) {
    throw new Error('Esa imagen ya está guardada como logo personal');
  }
  return savePersonalLogos(userId, [...current, logo]);
}

export async function removePersonalLogo(
  userId: string,
  logoId: string
): Promise<{ logos: PersonalLogo[]; equippedLogoId: string | null }> {
  const profile = await getOrCreate(userId);
  const logos = profile.personalLogos.filter((logo) => logo.id !== logoId);
  const nextEquipped = profile.equippedLogoId === logoId ? null : profile.equippedLogoId;
  await savePersonalLogos(userId, logos);
  if (nextEquipped !== profile.equippedLogoId) {
    await saveShopInventory(userId, {
      inventory: profile.shopInventory,
      equippedLogoId: nextEquipped,
    });
  }
  return { logos, equippedLogoId: nextEquipped };
}
