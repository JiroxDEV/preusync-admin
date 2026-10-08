/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: users.js
 * Versión: v1.0.0
 * Descripción: Gestor de Usuarios y Roles de la plataforma.
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { ApiClient } from '../api.js';

export async function renderUsersManager(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Usuarios y Asignación de Roles</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Administra cuentas, verificaciones y privilegios de acceso</p>
      </div>

      <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="shield-check" class="w-5 h-5 text-sky-500"></i>
          Buscar Perfil por Nombre de Usuario
        </h2>
        <div class="flex gap-2">
          <input type="text" id="searchUsername" placeholder="Nombre de usuario (ej. JiroxDEV)" class="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <button id="btnSearchUser" class="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-all flex items-center gap-2">
            <i data-lucide="search" class="w-4 h-4"></i>
            Buscar
          </button>
        </div>

        <div id="userResultCard" class="hidden p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <h3 id="resFullName" class="font-bold text-slate-800 dark:text-slate-100">---</h3>
          <p id="resUsername" class="text-xs text-sky-600 dark:text-sky-400 font-semibold">---</p>
          <p id="resRole" class="text-xs text-slate-500 dark:text-slate-400">---</p>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  document.getElementById('btnSearchUser').addEventListener('click', async () => {
    const uname = document.getElementById('searchUsername').value.trim();
    if (!uname) return;

    try {
      const res = await ApiClient.request(`/auth/exists/${encodeURIComponent(uname)}`);
      const card = document.getElementById('userResultCard');
      card.classList.remove('hidden');
      document.getElementById('resFullName').innerText = uname;
      document.getElementById('resUsername').innerText = `@${uname}`;
      document.getElementById('resRole').innerText = res.exists ? 'Cuenta Registrada' : 'Usuario no encontrado';
    } catch (e) {
      alert('Error en búsqueda: ' + e.message);
    }
  });
}
