/**
 * SERVICE BASE - Clase abstracta para servicios en modo localStorage
 * Proporciona métodos comunes para CRUD operations
 * Solo se usa cuando API_CONFIG.MODE === 'localStorage'
 * Con MODE === 'supabase' se usan los servicios Supabase directamente
 */

import API_CONFIG from './api.config';

export class BaseService {
  constructor(resourceName) {
    this.resourceName = resourceName;
    this.localStorageKey = `icfes_${resourceName}`;
  }

  _ensureLocalStorageMode() {
    if (API_CONFIG.MODE !== 'localStorage') {
      throw new Error(
        `BaseService solo se usa con MODE='localStorage'. Con MODE='supabase' usa los servicios Supabase directamente.`
      );
    }
  }

  /**
   * GET - Obtener uno o múltiples registros
   * @param {string} id - ID del registro (opcional)
   * @returns {Promise}
   */
  async get(id = null) {
    this._ensureLocalStorageMode();
    return this._getFromLocalStorage(id);
  }

  /**
   * POST - Crear un nuevo registro
   * @param {object} data - Datos del nuevo registro
   * @returns {Promise}
   */
  async create(data) {
    this._ensureLocalStorageMode();
    return this._createInLocalStorage(data);
  }

  /**
   * PUT - Actualizar un registro existente
   * @param {string} id - ID del registro
   * @param {object} data - Datos actualizados
   * @returns {Promise}
   */
  async update(id, data) {
    this._ensureLocalStorageMode();
    return this._updateInLocalStorage(id, data);
  }

  /**
   * DELETE - Eliminar un registro
   * @param {string} id - ID del registro
   * @returns {Promise}
   */
  async delete(id) {
    this._ensureLocalStorageMode();
    return this._deleteFromLocalStorage(id);
  }

  // ============ MÉTODOS PRIVADOS - localStorage ============

  _getFromLocalStorage(id) {
    return new Promise((resolve, reject) => {
      try {
        const data = localStorage.getItem(this.localStorageKey);
        const parsed = data ? JSON.parse(data) : [];

        if (id) {
          const item = parsed.find(item => item.id === id);
          resolve(item || null);
        } else {
          resolve(parsed);
        }
      } catch (error) {
        reject(new Error(`Error leyendo ${this.resourceName} de localStorage: ${error.message}`));
      }
    });
  }

  _createInLocalStorage(data) {
    return new Promise((resolve, reject) => {
      try {
        const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        
        const newItem = {
          id: `${this.resourceName}_${Date.now()}_${Math.random()}`,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        items.push(newItem);
        localStorage.setItem(this.localStorageKey, JSON.stringify(items));
        
        resolve(newItem);
      } catch (error) {
        reject(new Error(`Error creando ${this.resourceName}: ${error.message}`));
      }
    });
  }

  _updateInLocalStorage(id, data) {
    return new Promise((resolve, reject) => {
      try {
        const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        const index = items.findIndex(item => item.id === id);

        if (index === -1) {
          reject(new Error(`${this.resourceName} con ID ${id} no encontrado`));
          return;
        }

        items[index] = {
          ...items[index],
          ...data,
          updatedAt: new Date().toISOString()
        };

        localStorage.setItem(this.localStorageKey, JSON.stringify(items));
        resolve(items[index]);
      } catch (error) {
        reject(new Error(`Error actualizando ${this.resourceName}: ${error.message}`));
      }
    });
  }

  _deleteFromLocalStorage(id) {
    return new Promise((resolve, reject) => {
      try {
        const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        const filtered = items.filter(item => item.id !== id);

        if (items.length === filtered.length) {
          reject(new Error(`${this.resourceName} con ID ${id} no encontrado`));
          return;
        }

        localStorage.setItem(this.localStorageKey, JSON.stringify(filtered));
        resolve({ success: true, message: `${this.resourceName} eliminado` });
      } catch (error) {
        reject(new Error(`Error eliminando ${this.resourceName}: ${error.message}`));
      }
    });
  }
}

export default BaseService;
