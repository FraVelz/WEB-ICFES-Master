/**
 * UserSupabaseService - Gestión de usuarios en Supabase
 */
import { supabase } from '@/config/supabase';

import type { SkillLevel } from '@/features/auth/types/skillLevel';

const TABLE = 'users';

const VALID_SKILL_LEVELS: SkillLevel[] = ['basics', 'intermediate', 'advanced'];

function parseSkillLevel(value: unknown): SkillLevel | null {
  if (typeof value !== 'string') return null;
  return VALID_SKILL_LEVELS.includes(value as SkillLevel) ? (value as SkillLevel) : null;
}

const PROFILE_SUMMARY_COLUMNS =
  'id, email, display_name, username, bio, skill_level, level_assessment_completed_at, created_at, updated_at' as const;

const PROFILE_WITH_IMAGE_COLUMNS = `${PROFILE_SUMMARY_COLUMNS}, profile_image` as const;

export interface DbUserRow {
  id: string;
  email?: string | null;
  display_name?: string | null;
  username?: string | null;
  bio?: string | null;
  profile_image?: string | null;
  skill_level?: string | null;
  level_assessment_completed_at?: string | null;
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
  skillLevel: SkillLevel | null;
  levelAssessmentCompletedAt: string | null;
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
    profileImage: (r.profile_image as string | null) ?? null,
    skillLevel: parseSkillLevel(r.skill_level),
    levelAssessmentCompletedAt: (r.level_assessment_completed_at as string | null) ?? null,
    createdAt: (r.created_at as string | null) ?? null,
    updatedAt: (r.updated_at as string | null) ?? null,
  };
};

function ensureSupabase() {
  if (!supabase) throw new Error('Supabase no configurado');
  return supabase;
}

const UserSupabaseService = {
  async getProfileSummary(userId: string): Promise<MappedUser | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb
      .from(TABLE)
      .select(PROFILE_SUMMARY_COLUMNS)
      .eq('id', userId)
      .maybeSingle();
    if (error) throw new Error(`Error leyendo usuario: ${error.message}`);
    return data ? mapFromDb(data as unknown as Record<string, unknown>) : null;
  },

  async getByUserId(userId: string, options?: { includeProfileImage?: boolean }): Promise<MappedUser | null> {
    const sb = ensureSupabase();
    const columns: string = options?.includeProfileImage ? PROFILE_WITH_IMAGE_COLUMNS : PROFILE_SUMMARY_COLUMNS;
    const { data, error } = await sb.from(TABLE).select(columns).eq('id', userId).maybeSingle();
    if (error) throw new Error(`Error leyendo usuario: ${error.message}`);
    return data ? mapFromDb(data as unknown as Record<string, unknown>) : null;
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
    };
    const payload = {
      id: userId,
      email: ud.email ?? null,
      display_name: ud.displayName ?? ud.display_name ?? 'Usuario ICFES',
      username: ud.username ?? null,
      bio: ud.bio ?? null,
      profile_image: ud.profileImage ?? ud.profile_image ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await sb.from(TABLE).upsert(payload, { onConflict: 'id' }).select().single();
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
    };
    const payload: Record<string, unknown> = {
      display_name: pd.displayName ?? pd.display_name,
      username: pd.username,
      bio: pd.bio,
      profile_image: pd.profileImage ?? pd.profile_image,
      updated_at: new Date().toISOString(),
    };
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
    const { data, error } = await sb.from(TABLE).update(payload).eq('id', userId).select().single();
    if (error) throw new Error(`Error actualizando perfil: ${error.message}`);
    return mapFromDb(data as DbUserRow)!;
  },

  async updateSkillLevel(userId: string, skillLevel: SkillLevel): Promise<MappedUser> {
    const sb = ensureSupabase();
    const completedAt = new Date().toISOString();
    const { data, error } = await sb
      .from(TABLE)
      .update({
        skill_level: skillLevel,
        level_assessment_completed_at: completedAt,
        updated_at: completedAt,
      })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw new Error(`Error actualizando nivel de preparación: ${error.message}`);
    return mapFromDb(data as DbUserRow)!;
  },
};

export default UserSupabaseService;
