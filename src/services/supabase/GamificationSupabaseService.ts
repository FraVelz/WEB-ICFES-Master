/**
 * GamificationSupabaseService - Gestión de gamificación en Supabase
 */
import { supabase } from '@/config/supabase';
import { STARTING_COINS_BALANCE } from '@/shared/constants/gamification';
import { isLogoShopItem } from '@/features/store/data/shopCatalog';
import { DOUBLE_XP_DURATION_MS, isDoubleXpActive } from '@/features/store/constants/doubleXp';
import { MAX_STREAK_SHIELDS } from '@/features/store/constants/streakShield';
import {
  MAX_PERSONAL_LOGOS,
  type PersonalLogo,
  isPersonalLogoId,
} from '@/features/user/types/personalLogo.types';

const TABLE = 'user_gamification';

export interface GamificationProfile {
  userId: string;
  xp: number;
  totalCoins: number;
  spentCoins: number;
  achievements: unknown[];
  xpHistory: unknown[];
  coinsHistory: unknown[];
  streakDates: string[];
  longestStreak: number;
  shopInventory: string[];
  equippedLogoId: string | null;
  doubleXpExpiresAt: string | null;
  personalLogos: PersonalLogo[];
  streakShieldCount: number;
  updatedAt: unknown;
}

export interface ShopInventoryState {
  inventory: string[];
  equippedLogoId: string | null;
}

function parseShopInventory(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);
}

function parsePersonalLogos(value: unknown): PersonalLogo[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is PersonalLogo => {
      if (!entry || typeof entry !== 'object') return false;
      const row = entry as Record<string, unknown>;
      return (
        typeof row.id === 'string' &&
        row.id.length > 0 &&
        typeof row.image === 'string' &&
        row.image.length > 0 &&
        typeof row.label === 'string' &&
        typeof row.createdAt === 'string'
      );
    })
    .slice(0, MAX_PERSONAL_LOGOS);
}

const mapFromDb = (row: Record<string, unknown> | null): GamificationProfile | null => {
  if (!row || typeof row !== 'object') return null;
  return {
    userId: String(row.user_id ?? ''),
    xp: Number(row.xp ?? 0),
    totalCoins: Number(row.total_coins ?? 0),
    spentCoins: Number(row.spent_coins ?? 0),
    achievements: (row.achievements as unknown[]) || [],
    xpHistory: (row.xp_history as unknown[]) || [],
    coinsHistory: (row.coins_history as unknown[]) || [],
    streakDates: Array.isArray(row.streak_dates) ? (row.streak_dates as string[]) : [],
    longestStreak: Number(row.longest_streak ?? 0),
    shopInventory: parseShopInventory(row.shop_inventory),
    equippedLogoId: typeof row.equipped_logo_id === 'string' ? row.equipped_logo_id : null,
    doubleXpExpiresAt: typeof row.double_xp_expires_at === 'string' ? row.double_xp_expires_at : null,
    personalLogos: parsePersonalLogos(row.personal_logos),
    streakShieldCount: Math.min(
      MAX_STREAK_SHIELDS,
      Math.max(0, Number(row.streak_shield_count ?? 0))
    ),
    updatedAt: row.updated_at,
  };
};

function ensureSupabase() {
  if (!supabase) throw new Error('Supabase no configurado');
  return supabase;
}

const GamificationSupabaseService = {
  async getByUserId(userId: string): Promise<GamificationProfile | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb.from(TABLE).select('*').eq('user_id', userId).maybeSingle();
    if (error) throw new Error(`Error leyendo gamificación: ${error.message}`);
    return data ? mapFromDb(data as Record<string, unknown>) : null;
  },

  async getOrCreate(userId: string): Promise<GamificationProfile> {
    let profile = await this.getByUserId(userId);
    if (!profile) {
      const payload = {
        user_id: userId,
        xp: 0,
        total_coins: STARTING_COINS_BALANCE,
        spent_coins: 0,
        achievements: [],
        xp_history: [],
        coins_history: [],
        streak_dates: [],
        longest_streak: 0,
        shop_inventory: [],
        equipped_logo_id: null,
        double_xp_expires_at: null,
        personal_logos: [],
        streak_shield_count: 0,
        updated_at: new Date().toISOString(),
      };
      const sb = ensureSupabase();
      const { data, error } = await sb.from(TABLE).upsert(payload, { onConflict: 'user_id' }).select().single();
      if (error) throw new Error(`Error creando gamificación: ${error.message}`);
      profile = mapFromDb(data as Record<string, unknown>)!;
    }
    return profile;
  },

  async addXP(userId: string, points: number, reason = 'activity'): Promise<GamificationProfile> {
    const profile = await this.getOrCreate(userId);
    const multiplier = isDoubleXpActive(profile.doubleXpExpiresAt) ? 2 : 1;
    const awardedPoints = points * multiplier;
    const newXP = (profile.xp || 0) + awardedPoints;
    const xpHistory = [
      ...(profile.xpHistory || []),
      {
        date: new Date().toISOString(),
        points: awardedPoints,
        basePoints: points,
        multiplier,
        reason,
      },
    ];

    const payload = {
      user_id: userId,
      xp: newXP,
      xp_history: xpHistory,
      updated_at: new Date().toISOString(),
    };
    const sb = ensureSupabase();
    const { data, error } = await sb.from(TABLE).upsert(payload, { onConflict: 'user_id' }).select().single();
    if (error) throw new Error(`Error añadiendo XP: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!;
  },

  async addCoins(userId: string, amount: number, reason = 'reward'): Promise<GamificationProfile> {
    const profile = await this.getOrCreate(userId);
    const newTotalCoins = (profile.totalCoins || 0) + amount;
    const coinsHistory = [
      ...(profile.coinsHistory || []),
      { date: new Date().toISOString(), amount, reason, type: 'earn' },
    ];

    const payload = {
      user_id: userId,
      total_coins: newTotalCoins,
      coins_history: coinsHistory,
      updated_at: new Date().toISOString(),
    };
    const sb = ensureSupabase();
    const { data, error } = await sb.from(TABLE).upsert(payload, { onConflict: 'user_id' }).select().single();
    if (error) throw new Error(`Error añadiendo monedas: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!;
  },

  async spendCoins(userId: string, amount: number, item = 'purchase'): Promise<GamificationProfile> {
    const profile = await this.getOrCreate(userId);
    const available = (profile.totalCoins || 0) - (profile.spentCoins || 0);
    if (available < amount) throw new Error('Monedas insuficientes');
    const newSpent = (profile.spentCoins || 0) + amount;
    const coinsHistory = [
      ...(profile.coinsHistory || []),
      { date: new Date().toISOString(), amount, item, type: 'spend' },
    ];

    const payload = {
      user_id: userId,
      spent_coins: newSpent,
      coins_history: coinsHistory,
      updated_at: new Date().toISOString(),
    };
    const sb = ensureSupabase();
    const { data, error } = await sb.from(TABLE).update(payload).eq('user_id', userId).select().single();
    if (error) throw new Error(`Error gastando monedas: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!;
  },

  async getStreak(userId: string): Promise<{ dates: string[]; longestStreak: number }> {
    const profile = await this.getOrCreate(userId);
    return {
      dates: profile.streakDates ?? [],
      longestStreak: profile.longestStreak ?? 0,
    };
  },

  async updateStreak(userId: string, state: { dates: string[]; longestStreak: number }): Promise<GamificationProfile> {
    await this.getOrCreate(userId);
    const sb = ensureSupabase();
    const payload = {
      user_id: userId,
      streak_dates: state.dates,
      longest_streak: state.longestStreak,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await sb.from(TABLE).upsert(payload, { onConflict: 'user_id' }).select().single();
    if (error) throw new Error(`Error guardando racha: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!;
  },

  async updateAchievements(userId: string, achievements: Record<string, unknown>): Promise<GamificationProfile> {
    await this.getOrCreate(userId);
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from(TABLE)
      .update({ achievements, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(`Error actualizando logros: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!;
  },

  async getShopInventory(userId: string): Promise<ShopInventoryState> {
    const profile = await this.getOrCreate(userId);
    return {
      inventory: profile.shopInventory ?? [],
      equippedLogoId: profile.equippedLogoId ?? null,
    };
  },

  async saveShopInventory(userId: string, state: ShopInventoryState): Promise<ShopInventoryState> {
    await this.getOrCreate(userId);
    const sb = ensureSupabase();
    const payload = {
      user_id: userId,
      shop_inventory: state.inventory,
      equipped_logo_id: state.equippedLogoId,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await sb.from(TABLE).upsert(payload, { onConflict: 'user_id' }).select().single();
    if (error) throw new Error(`Error guardando inventario de tienda: ${error.message}`);
    const profile = mapFromDb(data as Record<string, unknown>)!;
    return {
      inventory: profile.shopInventory ?? [],
      equippedLogoId: profile.equippedLogoId ?? null,
    };
  },

  async addShopItem(userId: string, itemId: string): Promise<ShopInventoryState> {
    const current = await this.getShopInventory(userId);
    if (current.inventory.includes(itemId)) return current;
    return this.saveShopInventory(userId, {
      inventory: [...current.inventory, itemId],
      equippedLogoId: current.equippedLogoId,
    });
  },

  async setEquippedLogo(userId: string, logoId: string | null): Promise<ShopInventoryState> {
    const profile = await this.getOrCreate(userId);
    if (logoId) {
      const ownsShopLogo = isLogoShopItem(logoId) && profile.shopInventory.includes(logoId);
      const ownsPersonalLogo = isPersonalLogoId(logoId) && profile.personalLogos.some((logo) => logo.id === logoId);
      if (!ownsShopLogo && !ownsPersonalLogo) {
        throw new Error('No tienes este logo en tu inventario');
      }
    }
    return this.saveShopInventory(userId, {
      inventory: profile.shopInventory,
      equippedLogoId: logoId,
    });
  },

  async getPersonalLogos(userId: string): Promise<PersonalLogo[]> {
    const profile = await this.getOrCreate(userId);
    return profile.personalLogos ?? [];
  },

  async savePersonalLogos(userId: string, logos: PersonalLogo[]): Promise<PersonalLogo[]> {
    await this.getOrCreate(userId);
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from(TABLE)
      .update({
        personal_logos: logos.slice(0, MAX_PERSONAL_LOGOS),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(`Error guardando logos personales: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!.personalLogos;
  },

  async addPersonalLogo(userId: string, logo: PersonalLogo): Promise<PersonalLogo[]> {
    const current = await this.getPersonalLogos(userId);
    if (current.length >= MAX_PERSONAL_LOGOS) {
      throw new Error(`Solo puedes guardar hasta ${MAX_PERSONAL_LOGOS} logos personales`);
    }
    if (current.some((entry) => entry.image === logo.image)) {
      throw new Error('Esa imagen ya está guardada como logo personal');
    }
    return this.savePersonalLogos(userId, [...current, logo]);
  },

  async removePersonalLogo(userId: string, logoId: string): Promise<{ logos: PersonalLogo[]; equippedLogoId: string | null }> {
    const profile = await this.getOrCreate(userId);
    const logos = profile.personalLogos.filter((logo) => logo.id !== logoId);
    const nextEquipped = profile.equippedLogoId === logoId ? null : profile.equippedLogoId;
    await this.savePersonalLogos(userId, logos);
    if (nextEquipped !== profile.equippedLogoId) {
      await this.saveShopInventory(userId, {
        inventory: profile.shopInventory,
        equippedLogoId: nextEquipped,
      });
    }
    return { logos, equippedLogoId: nextEquipped };
  },

  async setStreakShieldCount(userId: string, count: number): Promise<number> {
    await this.getOrCreate(userId);
    const normalized = Math.min(MAX_STREAK_SHIELDS, Math.max(0, count));
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from(TABLE)
      .update({
        streak_shield_count: normalized,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(`Error guardando protectores de racha: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!.streakShieldCount;
  },

  async activateDoubleXp(userId: string): Promise<string> {
    const profile = await this.getOrCreate(userId);
    const now = Date.now();
    const current = profile.doubleXpExpiresAt ? new Date(profile.doubleXpExpiresAt).getTime() : 0;
    const base = Math.max(now, current);
    const expiresAt = new Date(base + DOUBLE_XP_DURATION_MS).toISOString();

    const sb = ensureSupabase();
    const { data, error } = await sb
      .from(TABLE)
      .update({
        double_xp_expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(`Error activando Doble XP: ${error.message}`);
    return mapFromDb(data as Record<string, unknown>)!.doubleXpExpiresAt ?? expiresAt;
  },
};

export default GamificationSupabaseService;
