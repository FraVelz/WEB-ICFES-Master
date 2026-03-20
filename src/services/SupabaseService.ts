/**
 * SupabaseService - Clase base para servicios que usan Supabase
 * Reemplaza BaseService cuando API_CONFIG.MODE === 'supabase'
 */

import { supabase } from '@/config/supabase';

export class SupabaseService {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Obtener sesión actual (para user_id)
   */
  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  }

  /**
   * GET - Obtener uno o múltiples registros
   */
  async get(id = null, options = {}) {
    const { column = 'id', userIdColumn = 'user_id' } = options;

    if (id) {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq(column, id)
        .maybeSingle();

      if (error)
        throw new Error(`Error leyendo ${this.tableName}: ${error.message}`);
      return data;
    }

    const { data, error } = await supabase.from(this.tableName).select('*');

    if (error)
      throw new Error(`Error leyendo ${this.tableName}: ${error.message}`);
    return data || [];
  }

  /**
   * Obtener por user_id
   */
  async getByUserId(userId) {
    const { data, error } = await supabase
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
  async create(data) {
    const { data: inserted, error } = await supabase
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
  async update(id, data, options = {}) {
    const { column = 'id' } = options;
    const payload = {
      ...this._toSnakeCase(data),
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await supabase
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
  async delete(id, options = {}) {
    const { column = 'id' } = options;
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq(column, id);

    if (error)
      throw new Error(`Error eliminando ${this.tableName}: ${error.message}`);
    return { success: true };
  }

  _toSnakeCase(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      const snake = k.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`);
      result[snake] = v;
    }
    return result;
  }

  _toCamelCase(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      const camel = k.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
      result[camel] = v;
    }
    return result;
  }
}

export default SupabaseService;
