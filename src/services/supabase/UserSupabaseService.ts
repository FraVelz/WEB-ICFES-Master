/**
 * UserSupabaseService - Gestión de usuarios en Supabase
 */
import { supabase } from '@/config/supabase';

const TABLE = 'users';

export interface DbUserRow {
  id: string;
  email?: string | null;
  display_name?: string | null;
  username?: string | null;
  bio?: string | null;
  profile_image?: string | null;
  photo_url?: string | null;
  virtual_money?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MappedUser {
  id: string;
  email: string | null;
  displayName: string | null;
  username: string | null;
  bio: string | null;
  profileImage: string | null;
  virtualMoney: number;
  createdAt: string | null;
  updatedAt: string | null;
}

const mapFromDb = (row: DbUserRow | Record<string, unknown> | null): MappedUser | null => {
  if (!row || typeof row !== 'object') return null;
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id ?? ''),
    email: (r.email as string | null) ?? null,
    displayName: (r.display_name as string | null) ?? null,
    username: (r.username as string | null) ?? null,
    bio: (r.bio as string | null) ?? null,
    profileImage: ((r.profile_image ?? r.photo_url) as string | null) ?? null,
    virtualMoney: Number(r.virtual_money) || 0,
    createdAt: (r.created_at as string | null) ?? null,
    updatedAt: (r.updated_at as string | null) ?? null,
  };
};

function ensureSupabase() {
  if (!supabase) throw new Error('Supabase no configurado');
  return supabase;
}

const UserSupabaseService = {
  async getByUserId(userId: string): Promise<MappedUser | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from(TABLE)
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw new Error(`Error leyendo usuario: ${error.message}`);
    return data ? mapFromDb(data) : null;
  },

  async createUser(userId: string, userData: Record<string, unknown>): Promise<MappedUser> {
    const sb = ensureSupabase();
    const ud = userData as {
      email?: string;
      displayName?: string;
      display_name?: string;
      username?: string;
      bio?: string;
      profileImage?: string;
      profile_image?: string;
      photoURL?: string;
      photo_url?: string;
      virtualMoney?: number;
      virtual_money?: number;
    };
    const payload = {
      id: userId,
      email: ud.email ?? null,
      display_name: ud.displayName ?? ud.display_name ?? 'Usuario ICFES',
      username: ud.username ?? null,
      bio: ud.bio ?? null,
      profile_image: ud.profileImage ?? ud.profile_image ?? null,
      photo_url: ud.photoURL ?? ud.photo_url ?? null,
      virtual_money: ud.virtualMoney ?? ud.virtual_money ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await sb
      .from(TABLE)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw new Error(`Error creando usuario: ${error.message}`);
    return mapFromDb(data as DbUserRow)!;
  },

  async updateProfile(userId: string, profileData: Record<string, unknown>): Promise<MappedUser> {
    const sb = ensureSupabase();
    const pd = profileData as {
      displayName?: string;
      display_name?: string;
      username?: string;
      bio?: string;
      profileImage?: string;
      profile_image?: string;
      virtualMoney?: number;
      virtual_money?: number;
    };
    const payload: Record<string, unknown> = {
      display_name: pd.displayName ?? pd.display_name,
      username: pd.username,
      bio: pd.bio,
      profile_image: pd.profileImage ?? pd.profile_image,
      virtual_money: pd.virtualMoney ?? pd.virtual_money,
      updated_at: new Date().toISOString(),
    };
    Object.keys(payload).forEach(
      (k) => payload[k] === undefined && delete payload[k]
    );
    const { data, error } = await sb
      .from(TABLE)
      .update(payload)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw new Error(`Error actualizando perfil: ${error.message}`);
    return mapFromDb(data as DbUserRow)!;
  },

  async updateVirtualMoney(userId: string, amount: number): Promise<MappedUser> {
    const user = await this.getByUserId(userId);
    const current = (user?.virtualMoney ?? 0) + amount;
    return this.updateProfile(userId, { virtualMoney: current });
  },
};

export default UserSupabaseService;
