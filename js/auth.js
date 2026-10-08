/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: auth.js
 * Versión: v1.0.0
 * Descripción: Módulo de autenticación y verificación de permisos administrativos.
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { ApiClient } from './api.js';
import { CONFIG } from './config.js';

export class AuthManager {
  static getUser() {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  static isAuthenticated() {
    return !!ApiClient.getToken();
  }

  static async login(username, password) {
    const response = await ApiClient.login(username, password);
    if (response.success && response.data) {
      const { sessionToken, refreshToken, user, profile } = response.data;

      // Permitir acceso solo a usuarios con rol administrativo o de staff
      const userRole = (profile && profile.role) || (user && user.role) || 'student';

      ApiClient.setSession(sessionToken, refreshToken, {
        id: user ? user.id : profile.id,
        username: profile ? profile.username : username,
        fullName: profile ? (profile.full_name || profile.username) : username,
        role: userRole,
        avatar: profile ? profile.avatar_url : ''
      });

      return { success: true, role: userRole };
    }
    throw new Error(response.error || 'Error al iniciar sesión');
  }

  static logout() {
    ApiClient.clearSession();
    window.location.reload();
  }
}
