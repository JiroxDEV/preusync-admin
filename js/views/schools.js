/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: schools.js
 * Versión: v1.1.0
 * Descripción: Gestor de Jerarquía Nacional y Escuelas (Consulta 100% Dinámica).
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { ApiClient } from '../api.js';

let selectedProvinceName = 'Artemisa';
let selectedMunicipalityName = 'Artemisa';

export async function renderSchoolsManager(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Jerarquía Nacional y Escuelas</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Navega por las provincias, municipios e instituciones educativas registradas en la API</p>
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
          <h2 id="schoolTitleText" class="text-xl font-bold text-slate-800 dark:text-slate-100">Seleccione una escuela arriba</h2>
        </div>
        <p id="schoolMetaText" class="text-sm text-slate-500 dark:text-slate-400">Navegue por el menú jerárquico para inspeccionar las escuelas registradas en la base de datos.</p>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Grupos Oficiales Asignados</h3>
          <div id="schoolGroupsContainer" class="flex flex-wrap gap-2">
            <span class="text-xs text-slate-400">Seleccione una escuela para ver sus grupos.</span>
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
    sel.innerHTML = '<option value="">Seleccione provincia...</option>' + items.map(p => `<option value="${p.id}" data-name="${p.name}">${p.name}</option>`).join('');

    sel.addEventListener('change', async (e) => {
      const pId = e.target.value;
      const opt = sel.options[sel.selectedIndex];
      selectedProvinceName = opt ? opt.dataset.name : '';
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
    sel.innerHTML = '<option value="">Seleccione municipio...</option>' + items.map(m => `<option value="${m.id}" data-name="${m.name}">${m.name}</option>`).join('');

    sel.addEventListener('change', async (e) => {
      const mId = e.target.value;
      const opt = sel.options[sel.selectedIndex];
      selectedMunicipalityName = opt ? opt.dataset.name : '';
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
    sel.innerHTML = '<option value="">Seleccione escuela...</option>' + items.map(s => `<option value="${s.id}" data-name="${s.name}">${s.name}</option>`).join('');

    sel.addEventListener('change', async (e) => {
      const sId = e.target.value;
      const opt = sel.options[sel.selectedIndex];
      if (sId && opt) {
        loadSchoolDetails(sId, opt.dataset.name);
      }
    });
  } catch (e) {
    sel.innerHTML = '<option value="">Error al cargar escuelas</option>';
  }
}

async function loadSchoolDetails(schoolId, schoolName) {
  const cardTitle = document.getElementById('schoolTitleText');
  const cardMeta = document.getElementById('schoolMetaText');
  const groupsContainer = document.getElementById('schoolGroupsContainer');

  cardTitle.innerText = schoolName;
  cardMeta.innerText = `Provincia: ${selectedProvinceName || '---'} | Municipio: ${selectedMunicipalityName || '---'} | Estatus: Verificada y Activa`;
  groupsContainer.innerHTML = '<span class="text-xs text-slate-400">Cargando grupos desde la API...</span>';

  try {
    const res = await ApiClient.getGroups(schoolId);
    const groups = res.data || [];
    if (groups.length === 0) {
      groupsContainer.innerHTML = '<span class="text-xs text-slate-400">No hay grupos registrados para esta escuela en la BD.</span>';
    } else {
      groupsContainer.innerHTML = groups.map(g => `
        <span class="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 font-semibold text-xs border border-sky-200 dark:border-sky-800">${g.name}</span>
      `).join('');
    }
  } catch (e) {
    groupsContainer.innerHTML = '<span class="text-xs text-rose-400">Error al cargar grupos.</span>';
  }
}
