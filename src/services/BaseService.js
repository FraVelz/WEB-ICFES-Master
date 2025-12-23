/**
 * SERVICE BASE - Clase abstracta para todos los servicios
 * Proporciona métodos comunes para CRUD operations
 * Maneja tanto localStorage como API automáticamente
 */

import API_CONFIG from './api.config';

export class BaseService {
  constructor(resourceName) {
    this.resourceName = resourceName;
    this.localStorageKey = `icfes_${resourceName}`;
  }

  /**
   * GET - Obtener uno o múltiples registros
   * @param {string} id - ID del registro (opcional)
   * @returns {Promise}
   */
  async get(id = null) {
    if (API_CONFIG.MODE === 'localStorage') {
      return this._getFromLocalStorage(id);
    } else {
      return this._getFromAPI(id);
    }
  }

  /**
   * POST - Crear un nuevo registro
   * @param {object} data - Datos del nuevo registro
   * @returns {Promise}
   */
  async create(data) {
    if (API_CONFIG.MODE === 'localStorage') {
      return this._createInLocalStorage(data);
    } else {
      return this._createInAPI(data);
    }
  }

  /**
   * PUT - Actualizar un registro existente
   * @param {string} id - ID del registro
   * @param {object} data - Datos actualizados
   * @returns {Promise}
   */
  async update(id, data) {
    if (API_CONFIG.MODE === 'localStorage') {
      return this._updateInLocalStorage(id, data);
    } else {
      return this._updateInAPI(id, data);
    }
  }

  /**
   * DELETE - Eliminar un registro
   * @param {string} id - ID del registro
   * @returns {Promise}
   */
  async delete(id) {
    if (API_CONFIG.MODE === 'localStorage') {
      return this._deleteFromLocalStorage(id);
    } else {
      return this._deleteFromAPI(id);
    }
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

  // ============ MÉTODOS PRIVADOS - API REST ============

  async _getFromAPI(id) {
    const endpoint = id ? `${API_CONFIG.API_URL}/${this.resourceName}/${id}` : `${API_CONFIG.API_URL}/${this.resourceName}`;
    return this._fetchWithAuth('GET', endpoint);
  }

  async _createInAPI(data) {
    return this._fetchWithAuth('POST', `${API_CONFIG.API_URL}/${this.resourceName}`, data);
  }

  async _updateInAPI(id, data) {
    return this._fetchWithAuth('PUT', `${API_CONFIG.API_URL}/${this.resourceName}/${id}`, data);
  }

  async _deleteFromAPI(id) {
    return this._fetchWithAuth('DELETE', `${API_CONFIG.API_URL}/${this.resourceName}/${id}`);
  }

  async _fetchWithAuth(method, endpoint, body = null) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Agregar token si existe
      if (API_CONFIG.API_TOKEN) {
        options.headers['Authorization'] = `Bearer ${API_CONFIG.API_TOKEN}`;
      }

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await Promise.race([
        fetch(endpoint, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), API_CONFIG.TIMEOUT)
        )
      ]);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Error de API en ${this.resourceName}: ${error.message}`);
    }
  }
}

export default BaseService;
