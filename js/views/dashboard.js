/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: dashboard.js
 * Versión: v1.0.0
 * Descripción: Vista Principal con métricas, estado de la API y estadísticas.
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { ApiClient } from '../api.js';

export async function renderDashboard(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Panel Principal</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Resumen operativo y métricas en tiempo real de PreuSync</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            API Operativa (Render)
          </span>
        </div>
      </div>

      <!-- Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Escuelas registradas</p>
            <h3 id="statSchools" class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">Cargando...</h3>
          </div>
          <div class="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
            <i data-lucide="school" class="w-6 h-6"></i>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Grupos oficiales</p>
            <h3 id="statGroups" class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">Cargando...</h3>
          </div>
          <div class="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <i data-lucide="users" class="w-6 h-6"></i>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Publicaciones</p>
            <h3 id="statPosts" class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">Cargando...</h3>
          </div>
          <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <i data-lucide="message-square" class="w-6 h-6"></i>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Noticias publicadas</p>
            <h3 id="statNews" class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">Cargando...</h3>
          </div>
          <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <i data-lucide="newspaper" class="w-6 h-6"></i>
          </div>
        </div>
      </div>

      <!-- Feed Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Posts Recientes -->
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i data-lucide="message-square" class="w-5 h-5 text-sky-500"></i>
              Publicaciones Recientes
            </h2>
          </div>
          <div id="dashboardPostsList" class="space-y-3">
            <div class="p-4 text-center text-slate-400">Cargando publicaciones...</div>
          </div>
        </div>

        <!-- Noticias Recientes -->
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <i data-lucide="newspaper" class="w-5 h-5 text-purple-500"></i>
              Noticias Destacadas
            </h2>
          </div>
          <div id="dashboardNewsList" class="space-y-3">
            <div class="p-4 text-center text-slate-400">Cargando noticias...</div>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Carga de datos reales desde la API
  try {
    const [provincesRes, postsRes, newsRes] = await Promise.all([
      ApiClient.getProvinces().catch(() => ({ data: [] })),
      ApiClient.getPostsRange(0, 5).catch(() => ({ data: [] })),
      ApiClient.getTopNews(5).catch(() => ({ data: [] }))
    ]);

    const posts = postsRes.data || [];
    const news = newsRes.data || [];

    document.getElementById('statSchools').innerText = 'IPVCE Humboldt';
    document.getElementById('statGroups').innerText = '6 Grupos';
    document.getElementById('statPosts').innerText = `${posts.length}+`;
    document.getElementById('statNews').innerText = `${news.length}`;

    // Render Posts
    const postsContainer = document.getElementById('dashboardPostsList');
    if (posts.length === 0) {
      postsContainer.innerHTML = '<div class="p-4 text-center text-slate-400 text-sm">No hay publicaciones recientes.</div>';
    } else {
      postsContainer.innerHTML = posts.map(p => `
        <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
          <div class="space-y-1">
            <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">${p.title || p.details}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">${p.details}</p>
            <span class="text-[11px] text-sky-600 dark:text-sky-400 font-medium">@${p.author || 'Usuario'}</span>
          </div>
        </div>
      `).join('');
    }

    // Render News
    const newsContainer = document.getElementById('dashboardNewsList');
    if (news.length === 0) {
      newsContainer.innerHTML = '<div class="p-4 text-center text-slate-400 text-sm">No hay noticias registradas.</div>';
    } else {
      newsContainer.innerHTML = news.map(n => `
        <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
          <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">${n.headline}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">${n.details}</p>
          <span class="text-[11px] text-purple-600 dark:text-purple-400 font-medium">${n.source || 'PreuSync'}</span>
        </div>
      `).join('');
    }

  } catch (e) {
    console.error('Error al cargar dashboard:', e);
  }
}
