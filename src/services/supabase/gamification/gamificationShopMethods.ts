import { isLogoShopItem } from '@/features/store/data/shopCatalog';
import { isPersonalLogoId } from '@/features/user/types/personalLogo.types';
import type { ShopInventoryState } from './gamificationTypes';
import { ensureSupabase, GAMIFICATION_TABLE, mapFromDb } from './gamificationMappers';
import { getOrCreate } from './gamificationProfileMethods';

export async function getShopInventory(userId: string): Promise<ShopInventoryState> {
  const profile = await getOrCreate(userId);
  return {
    inventory: profile.shopInventory ?? [],
    equippedLogoId: profile.equippedLogoId ?? null,
  };
}

export async function saveShopInventory(
  userId: string,
  state: ShopInventoryState
): Promise<ShopInventoryState> {
  await getOrCreate(userId);
  const sb = ensureSupabase();
  const payload = {
    user_id: userId,
    shop_inventory: state.inventory,
    equipped_logo_id: state.equippedLogoId,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await sb
    .from(GAMIFICATION_TABLE)
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw new Error(`Error guardando inventario de tienda: ${error.message}`);
  const profile = mapFromDb(data as Record<string, unknown>)!;
  return {
    inventory: profile.shopInventory ?? [],
    equippedLogoId: profile.equippedLogoId ?? null,
  };
}

export async function addShopItem(userId: string, itemId: string): Promise<ShopInventoryState> {
  const current = await getShopInventory(userId);
  if (current.inventory.includes(itemId)) return current;
  return saveShopInventory(userId, {
    inventory: [...current.inventory, itemId],
    equippedLogoId: current.equippedLogoId,
  });
}

export async function setEquippedLogo(
  userId: string,
  logoId: string | null
): Promise<ShopInventoryState> {
  const profile = await getOrCreate(userId);
  if (logoId) {
    const ownsShopLogo = isLogoShopItem(logoId) && profile.shopInventory.includes(logoId);
    const ownsPersonalLogo =
      isPersonalLogoId(logoId) && profile.personalLogos.some((logo) => logo.id === logoId);
    if (!ownsShopLogo && !ownsPersonalLogo) {
      throw new Error('No tienes este logo en tu inventario');
    }
  }
  return saveShopInventory(userId, {
    inventory: profile.shopInventory,
    equippedLogoId: logoId,
  });
}
