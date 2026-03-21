/**
 * SupabaseService - Clase base para servicios que usan Supabase
 * Reemplaza BaseService cuando API_CONFIG.MODE === 'supabase'
 */

import { supabase } from '@/config/supabase';

export class SupabaseService {
  tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  _ensureSupabase() {
    if (!supabase) throw new Error('Supabase no configurado');
    return supabase;
  }

  /**
   * Obtener sesión actual (para user_id)
   */
  async getSession() {
    const sb = this._ensureSupabase();
    const {
      data: { session },
    } = await sb.auth.getSession();
    return session;
  }

  /**
   * GET - Obtener uno o múltiples registros
   */
  async get(
    id: string | null = null,
    options: { column?: string; userIdColumn?: string } = {}
  ) {
    const sb = this._ensureSupabase();
    const { column = 'id' } = options;

    if (id) {
      const { data, error } = await sb
        .from(this.tableName)
        .select('*')
        .eq(column, id)
        .maybeSingle();

      if (error)
        throw new Error(`Error leyendo ${this.tableName}: ${error.message}`);
      return data;
    }

    const { data, error } = await sb.from(this.tableName).select('*');

    if (error)
      throw new Error(`Error leyendo ${this.tableName}: ${error.message}`);
    return data || [];
  }

  /**
   * Obtener por user_id
   */
  async getByUserId(userId: string) {
    const sb = this._ensureSupabase();
    const { data, error } = await sb
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error)
      throw new Error(`Error leyendo ${this.tableName}: ${error.message}`);
    return data;
  }

  /**
   * POST - Crear un nuevo registro
   */
  async create(data: Record<string, unknown>) {
    const sb = this._ensureSupabase();
    const { data: inserted, error } = await sb
      .from(this.tableName)
      .insert(this._toSnakeCase(data))
      .select()
      .single();

    if (error)
      throw new Error(`Error creando ${this.tableName}: ${error.message}`);
    return this._toCamelCase(inserted);
  }

  /**
   * PUT - Actualizar un registro
   */
  async update(
    id: string,
    data: Record<string, unknown>,
    options: { column?: string } = {}
  ) {
    const { column = 'id' } = options;
    const payload = {
      ...this._toSnakeCase(data),
      updated_at: new Date().toISOString(),
    };

    const sb = this._ensureSupabase();
    const { data: updated, error } = await sb
      .from(this.tableName)
      .update(payload)
      .eq(column, id)
      .select()
      .single();

    if (error)
      throw new Error(`Error actualizando ${this.tableName}: ${error.message}`);
    return this._toCamelCase(updated);
  }

  /**
   * DELETE - Eliminar un registro
   */
  async delete(id: string, options: { column?: string } = {}) {
    const { column = 'id' } = options;
    const sb = this._ensureSupabase();
    const { error } = await sb
      .from(this.tableName)
      .delete()
      .eq(column, id);

    if (error)
      throw new Error(`Error eliminando ${this.tableName}: ${error.message}`);
    return { success: true };
  }

  _toSnakeCase(obj: Record<string, unknown> | null): Record<string, unknown> {
    if (!obj || typeof obj !== 'object') return {};
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const snake = k.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
      result[snake] = v;
    }
    return result;
  }

  _toCamelCase(obj: Record<string, unknown> | null): Record<string, unknown> {
    if (!obj || typeof obj !== 'object') return {};
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const camel = k.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
      result[camel] = v;
    }
    return result;
  }
}

export default SupabaseService;
