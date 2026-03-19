/**
 * UserSupabaseService - Gestión de usuarios en Supabase
 */
import { supabase } from '@/config/supabase';

const TABLE = 'users';

const mapFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    username: row.username,
    bio: row.bio,
    profileImage: row.profile_image || row.photo_url,
    virtualMoney: Number(row.virtual_money) || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const UserSupabaseService = {
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw new Error(`Error leyendo usuario: ${error.message}`);
    return data ? mapFromDb(data) : null;
  },

  async createUser(userId, userData) {
    const payload = {
      id: userId,
      email: userData.email || null,
      display_name:
        userData.displayName || userData.display_name || 'Usuario ICFES',
      username: userData.username || null,
      bio: userData.bio || null,
      profile_image: userData.profileImage || userData.profile_image || null,
      photo_url: userData.photoURL || userData.photo_url || null,
      virtual_money: userData.virtualMoney ?? userData.virtual_money ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw new Error(`Error creando usuario: ${error.message}`);
    return mapFromDb(data);
  },

  async updateProfile(userId, profileData) {
    const payload = {
      display_name: profileData.displayName ?? profileData.display_name,
      username: profileData.username,
      bio: profileData.bio,
      profile_image: profileData.profileImage ?? profileData.profile_image,
      virtual_money: profileData.virtualMoney ?? profileData.virtual_money,
      updated_at: new Date().toISOString(),
    };
    Object.keys(payload).forEach(
      (k) => payload[k] === undefined && delete payload[k]
    );
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw new Error(`Error actualizando perfil: ${error.message}`);
    return mapFromDb(data);
  },

  async updateVirtualMoney(userId, amount) {
    const user = await this.getByUserId(userId);
    const current = (user?.virtualMoney ?? 0) + amount;
    return this.updateProfile(userId, { virtualMoney: current });
  },
};

export default UserSupabaseService;
