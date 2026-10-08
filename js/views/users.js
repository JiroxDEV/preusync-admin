/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: users.js
 * Versión: v1.1.0
 * Descripción: Gestor de Usuarios, Asignación de Roles y Moderación de Estatus.
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { ApiClient } from '../api.js';

let foundUserData = null;

export async function renderUsersManager(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Gestión de Usuarios y Roles</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Busca perfiles de usuarios, asigna roles académicos y cambia el estado de las cuentas</p>
      </div>

      <!-- Buscador de Usuario -->
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="search" class="w-5 h-5 text-sky-500"></i>
          Buscar Perfil por Nombre de Usuario
        </h2>
        <div class="flex gap-2">
          <input type="text" id="searchUsername" placeholder="Nombre de usuario (ej. JiroxDEV)" class="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <button id="btnSearchUser" class="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-sm">
            <i data-lucide="user-check" class="w-4 h-4"></i>
            Buscar Perfil
          </button>
        </div>

        <!-- Tarjeta de Resultado y Editor -->
        <div id="userResultCard" class="hidden p-6 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-4">
          <div class="flex items-start justify-between">
            <div>
              <h3 id="resFullName" class="text-lg font-bold text-slate-800 dark:text-slate-100">---</h3>
              <p id="resUsername" class="text-xs text-sky-600 dark:text-sky-400 font-semibold">---</p>
            </div>
            <span id="resStatusBadge" class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Verificado
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div><span class="font-bold text-slate-700 dark:text-slate-300">ID Carnet:</span> <span id="resIdCard">---</span></div>
            <div><span class="font-bold text-slate-700 dark:text-slate-300">Escuela:</span> <span id="resSchool">---</span></div>
            <div><span class="font-bold text-slate-700 dark:text-slate-300">Municipio:</span> <span id="resMunicipality">---</span></div>
            <div><span class="font-bold text-slate-700 dark:text-slate-300">Provincia:</span> <span id="resProvince">---</span></div>
          </div>

          <!-- Formulario de Modificación de Rol y Estatus -->
          <div class="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Modificar Rol y Estado de Cuenta</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-slate-500 mb-1">Rol Académico / Plataforma</label>
                <select id="editUserRole" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <option value="student">Estudiante</option>
                  <option value="teacher">Profesor</option>
                  <option value="tutor">Tutor / Padre</option>
                  <option value="staff">Staff Institucional</option>
                  <option value="admin">Administrador General</option>
                </select>
              </div>

              <div>
                <label class="block text-xs text-slate-500 mb-1">Estado de la Cuenta</label>
                <select id="editUserStatus" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <option value="verified">Verificada (Activa)</option>
                  <option value="warning">Advertencia (Limitada)</option>
                  <option value="banned">Suspendida / Baneada</option>
                </select>
              </div>
            </div>

            <button id="btnSaveUserRole" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm">
              Guardar Cambios de Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  document.getElementById('btnSearchUser').addEventListener('click', async () => {
    const uname = document.getElementById('searchUsername').value.trim();
    if (!uname) return;

    try {
      const res = await ApiClient.getUserByUsername(uname);
      const user = res.data;
      if (!user) {
        alert('Usuario no encontrado.');
        return;
      }

      foundUserData = user;
      const card = document.getElementById('userResultCard');
      card.classList.remove('hidden');

      document.getElementById('resFullName').innerText = user.first_name ? `${user.first_name} ${user.last_name || ''}` : (user.full_name || user.username);
      document.getElementById('resUsername').innerText = `@${user.username}`;
      document.getElementById('resIdCard').innerText = user.id_card || 'No registrada';
      document.getElementById('resSchool').innerText = user.school || 'Sin escuela';
      document.getElementById('resMunicipality').innerText = user.municipality || '---';
      document.getElementById('resProvince').innerText = user.province || '---';

      document.getElementById('editUserRole').value = user.role || 'student';
      document.getElementById('editUserStatus').value = user.status || 'verified';
    } catch (e) {
      alert('Error en búsqueda de usuario: ' + e.message);
    }
  });

  document.getElementById('btnSaveUserRole').addEventListener('click', async () => {
    if (!foundUserData || !foundUserData.id) {
      alert('Seleccione un usuario primero.');
      return;
    }

    const newRole = document.getElementById('editUserRole').value;
    const newStatus = document.getElementById('editUserStatus').value;

    try {
      await ApiClient.updateUserRoleStatus(foundUserData.id, { role: newRole, status: newStatus });
      alert('¡Rol y estado actualizados exitosamente!');
    } catch (e) {
      alert('Error al actualizar usuario: ' + e.message);
    }
  });
}
