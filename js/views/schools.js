/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: schools.js
 * Versión: v1.0.0
 * Descripción: Gestor de Jerarquía Nacional (Provincias, Municipios, Escuelas y Grupos).
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { ApiClient } from '../api.js';

export async function renderSchoolsManager(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Jerarquía Nacional y Escuelas</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Navega por las provincias, municipios e instituciones educativas registradas</p>
      </div>

      <!-- Selectores Jerárquicos -->
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">1. Provincia</label>
          <select id="selectProvince" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="">Cargando provincias...</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">2. Municipio</label>
          <select id="selectMunicipality" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" disabled>
            <option value="">Seleccione una provincia primero</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">3. Escuela / Preuniversitario</label>
          <select id="selectSchoolList" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" disabled>
            <option value="">Seleccione un municipio primero</option>
          </select>
        </div>
      </div>

      <!-- Detalle de Escuela Seleccionada -->
      <div id="schoolDetailCard" class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <div class="flex items-center gap-3 text-sky-600 dark:text-sky-400">
          <i data-lucide="school" class="w-6 h-6"></i>
          <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">IPVCE Mártires de Humboldt</h2>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400">Provincia: Artemisa | Municipio: Artemisa | Estatus: Verificada y Activa</p>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Grupos Oficiales Asignados</h3>
          <div id="schoolGroupsContainer" class="flex flex-wrap gap-2">
            <span class="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 font-semibold text-xs border border-sky-200 dark:border-sky-800">10 - 1</span>
            <span class="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 font-semibold text-xs border border-sky-200 dark:border-sky-800">10 - 2</span>
            <span class="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 font-semibold text-xs border border-sky-200 dark:border-sky-800">11 - 1</span>
            <span class="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 font-semibold text-xs border border-sky-200 dark:border-sky-800">11 - 2</span>
            <span class="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 font-semibold text-xs border border-sky-200 dark:border-sky-800">12 - 1</span>
            <span class="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 font-semibold text-xs border border-sky-200 dark:border-sky-800">12 - 2</span>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  loadProvinces();
}

async function loadProvinces() {
  const sel = document.getElementById('selectProvince');
  try {
    const res = await ApiClient.getProvinces();
    const items = res.data || [];
    sel.innerHTML = '<option value="">Seleccione provincia...</option>' + items.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

    sel.addEventListener('change', async (e) => {
      const pId = e.target.value;
      if (pId) loadMunicipalities(pId);
    });
  } catch (e) {
    sel.innerHTML = '<option value="">Error al cargar provincias</option>';
  }
}

async function loadMunicipalities(provinceId) {
  const sel = document.getElementById('selectMunicipality');
  sel.disabled = false;
  sel.innerHTML = '<option value="">Cargando municipios...</option>';
  try {
    const res = await ApiClient.getMunicipalities(provinceId);
    const items = res.data || [];
    sel.innerHTML = '<option value="">Seleccione municipio...</option>' + items.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

    sel.addEventListener('change', async (e) => {
      const mId = e.target.value;
      if (mId) loadSchoolsList(mId);
    });
  } catch (e) {
    sel.innerHTML = '<option value="">Error al cargar municipios</option>';
  }
}

async function loadSchoolsList(municipalityId) {
  const sel = document.getElementById('selectSchoolList');
  sel.disabled = false;
  sel.innerHTML = '<option value="">Cargando escuelas...</option>';
  try {
    const res = await ApiClient.getSchools(municipalityId);
    const items = res.data || [];
    sel.innerHTML = '<option value="">Seleccione escuela...</option>' + items.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  } catch (e) {
    sel.innerHTML = '<option value="">Error al cargar escuelas</option>';
  }
}
