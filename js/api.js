/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: api.js
 * Versión: v1.1.0
 * Descripción: Cliente HTTP centralizado para interactuar con la API de PreuSync.
 *              Incluye endpoints de creación de posts, eventos, efemérides y gestión de usuarios.
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { CONFIG } from './config.js';

export class ApiClient {
  static getToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
  }

  static getRefreshToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }

  static setSession(token, refreshToken, user) {
    if (token) localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
    if (refreshToken) localStorage.setItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    if (user) localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static clearSession() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
  }

  static async request(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const token = ApiClient.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });

      // Auto-renovación de token si vence (HTTP 401)
      if (response.status === 401 && ApiClient.getRefreshToken() && !endpoint.includes('/auth/refresh')) {
        const refreshed = await ApiClient.refreshSession();
        if (refreshed) {
          headers['Authorization'] = `Bearer ${ApiClient.getToken()}`;
          const retryRes = await fetch(url, { ...options, headers });
          return await retryRes.json();
        }
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error);
      throw error;
    }
  }

  static async refreshSession() {
    const refreshToken = ApiClient.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      const data = await res.json();
      if (data.success && data.data) {
        ApiClient.setSession(data.data.sessionToken, data.data.refreshToken, data.data.user);
        return true;
      }
    } catch (e) {
      ApiClient.clearSession();
    }
    return false;
  }

  // --- ENDPOINTS CORE ---
  static login(username, password) {
    return ApiClient.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }

  static getMe() {
    return ApiClient.request('/auth/me');
  }

  static getUserByUsername(username) {
    return ApiClient.request(`/users/by-username/${encodeURIComponent(username)}`);
  }

  static updateUserRoleStatus(userId, updateData) {
    return ApiClient.request(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  static getProvinces() {
    return ApiClient.request('/schools/provinces');
  }

  static getMunicipalities(provinceId) {
    return ApiClient.request(`/schools/municipalities?provinceId=${provinceId}`);
  }

  static getSchools(municipalityId) {
    return ApiClient.request(`/schools/institutions?municipalityId=${municipalityId}`);
  }

  static getGroups(schoolId) {
    return ApiClient.request(`/groups?schoolId=${schoolId}`);
  }

  static getSchedule(group, schoolId) {
    return ApiClient.request(`/schedule?group=${encodeURIComponent(group)}&schoolId=${schoolId}`);
  }

  static upsertSchedule(scheduleData) {
    return ApiClient.request('/schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData)
    });
  }

  static getTopPosts(limit = 10) {
    return ApiClient.request(`/posts/top?limit=${limit}`);
  }

  static getPostsRange(start = 0, count = 20) {
    return ApiClient.request(`/posts/range?start=${start}&count=${count}`);
  }

  static addPost(postData) {
    return ApiClient.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  }

  static getTopNews(limit = 10) {
    return ApiClient.request(`/news/top?limit=${limit}`);
  }

  static getNewsRange(start = 0, count = 20) {
    return ApiClient.request(`/news/range?start=${start}&count=${count}`);
  }

  static addNews(newsData) {
    return ApiClient.request('/news', {
      method: 'POST',
      body: JSON.stringify(newsData)
    });
  }

  static getSchoolEvents(schoolId, start = 0, count = 20) {
    return ApiClient.request(`/events/school?start=${start}&count=${count}&schoolId=${schoolId}`);
  }

  static getExternalEvents(start = 0, count = 20) {
    return ApiClient.request(`/events/external?start=${start}&count=${count}`);
  }

  static addEvent(eventData) {
    return ApiClient.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  }

  static getEphemeris(date) {
    return ApiClient.request(`/ephemeris?date=${encodeURIComponent(date)}`);
  }

  static addEphemeris(ephemerisData) {
    return ApiClient.request('/ephemeris', {
      method: 'POST',
      body: JSON.stringify(ephemerisData)
    });
  }

  static deleteEphemeris(id) {
    return ApiClient.request(`/ephemeris/${id}`, {
      method: 'DELETE'
    });
  }
}
