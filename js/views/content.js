/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: content.js
 * Versión: v1.0.0
 * Descripción: Gestor de Contenidos (Noticias, Posts destacados y Efemérides).
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { ApiClient } from '../api.js';

export async function renderContentManager(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Gestor de Contenidos</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Publica noticias destacadas, gestiona el feed y las efemérides</p>
        </div>
        <button id="btnNewNewsModal" class="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          Publicar Noticia
        </button>
      </div>

      <!-- Publicador de Noticias (Modal / Formulario) -->
      <div id="publishNewsCard" class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="newspaper" class="w-5 h-5 text-purple-500"></i>
          Crear Nueva Noticia Destacada
        </h2>
        <div class="space-y-3">
          <input type="text" id="newsHeadline" placeholder="Encabezado / Titular de la Noticia" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <textarea id="newsDetails" rows="3" placeholder="Detalles o descripción completa..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" id="newsSource" placeholder="Fuente (ej. Dirección IPVCE)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <input type="text" id="newsUrl" placeholder="URL externa (opcional)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <button id="btnPublishNews" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all">
            Enviar Noticia
          </button>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  document.getElementById('btnPublishNews').addEventListener('click', async () => {
    const headline = document.getElementById('newsHeadline').value.trim();
    const details = document.getElementById('newsDetails').value.trim();
    const source = document.getElementById('newsSource').value.trim() || 'PreuSync';
    const url = document.getElementById('newsUrl').value.trim() || 'https://preusync.com';

    if (!headline || !details) {
      alert('El titular y los detalles son obligatorios.');
      return;
    }

    try {
      await ApiClient.addNews({ headline, details, source, url, importance: 5 });
      alert('¡Noticia publicada con éxito!');
      document.getElementById('newsHeadline').value = '';
      document.getElementById('newsDetails').value = '';
    } catch (e) {
      alert('Error al publicar noticia: ' + e.message);
    }
  });
}
