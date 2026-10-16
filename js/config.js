/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: config.js
 * Versión: v1.0.0
 * Descripción: Configuración global del Panel Admin de PreuSync.
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

export const CONFIG = {
  // URL base del Nodo 1 de la API oficial de PreuSync en Render
  API_BASE_URL: 'https://preusync-api-node1.onrender.com/api',

  // Lista de Nodos Espejo de la Red Multi-Nodo para Failover
  NODE_URLS: [
    'https://preusync-api-node1.onrender.com/api',
    'https://preusync-api-node2.onrender.com/api',
    'https://preusync-api-node3.onrender.com/api'
  ],

  // Claves para persistencia en localStorage
  STORAGE_KEYS: {
    TOKEN: 'preusync_admin_token',
    REFRESH_TOKEN: 'preusync_admin_refresh_token',
    USER: 'preusync_admin_user',
    THEME: 'preusync_admin_theme'
  },

  // Nombre de la plataforma
  APP_NAME: 'PreuSync Admin',
  VERSION: 'v0.3.0'
};
