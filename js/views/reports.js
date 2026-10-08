/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: reports.js
 * Versión: v1.0.0
 * Descripción: Centro de Moderación y Reportes de Errores/Bugs.
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

export async function renderReportsManager(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Moderación y Reportes de Errores</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Audita denuncias de contenido y reportes automáticos de bugs generados desde la App</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Moderación de Contenido -->
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <i data-lucide="flag" class="w-5 h-5 text-amber-500"></i>
            Denuncias de Publicaciones
          </h2>
          <div class="p-4 text-center text-slate-400 text-sm">No hay denuncias pendientes de moderación.</div>
        </div>

        <!-- Reportes de Bugs -->
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <i data-lucide="bug" class="w-5 h-5 text-rose-500"></i>
            Informes de Crashes / GitHub Issues
          </h2>
          <div class="p-4 text-center text-slate-400 text-sm">Sistemas sin errores pendientes. Integrado con GitHub Issues.</div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}
