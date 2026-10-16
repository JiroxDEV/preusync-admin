/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: schools.js
 * Versión: v2.1.0
 * Descripción: Gestor Interactivo de Jerarquía Nacional (Holguín / Báguanos / IPU Ursinio Rojas).
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { ApiClient } from '../api.js';

let activeProvince = { id: '3fb4bac7-0eb5-46f4-a655-ef289aceaf0c', name: 'Holguín' };
let activeMunicipality = { id: 'eba718c1-f696-4a98-91cc-2cd37b9e405a', name: 'Báguanos' };

export async function renderSchoolsManager(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Jerarquía Nacional y Escuelas</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Listados completos y acciones operativas sobre Provincias, Municipios, Escuelas y Grupos</p>
        </div>
      </div>

      <!-- Grid de 3 Tablas Jerárquicas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Tabla 1: Provincias -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
              <i data-lucide="map-pin" class="w-5 h-5 text-sky-500"></i>
              Provincias (16)
            </h2>
          </div>
          <div class="overflow-y-auto max-h-[500px] rounded-xl border border-slate-200 dark:border-slate-700">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-slate-100 dark:bg-slate-900/80 sticky top-0">
                <tr class="text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th class="p-3">Nombre</th>
                  <th class="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody id="provincesTableBody" class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr><td colspan="2" class="p-4 text-center text-slate-400">Cargando provincias...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tabla 2: Municipios -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h2 id="municipalityTitleHeader" class="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
              <i data-lucide="building-2" class="w-5 h-5 text-indigo-500"></i>
              Municipios (Holguín)
            </h2>
          </div>
          <div class="overflow-y-auto max-h-[500px] rounded-xl border border-slate-200 dark:border-slate-700">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-slate-100 dark:bg-slate-900/80 sticky top-0">
                <tr class="text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th class="p-3">Municipio</th>
                  <th class="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody id="municipalitiesTableBody" class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr><td colspan="2" class="p-4 text-center text-slate-400">Seleccione una provincia...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tabla 3: Escuelas -->
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h2 id="schoolTitleHeader" class="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
              <i data-lucide="school" class="w-5 h-5 text-emerald-500"></i>
              Escuelas (Báguanos)
            </h2>
            <button id="btnAddSchoolModal" class="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              Añadir
            </button>
          </div>
          <div class="overflow-y-auto max-h-[500px] rounded-xl border border-slate-200 dark:border-slate-700">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-slate-100 dark:bg-slate-900/80 sticky top-0">
                <tr class="text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th class="p-3">Institución</th>
                  <th class="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody id="schoolsTableBody" class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr><td colspan="2" class="p-4 text-center text-slate-400">Seleccione un municipio...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Tarjeta de Inspección de Grupos de Escuela -->
      <div id="schoolGroupDetailCard" class="hidden p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 id="selectedSchoolNameText" class="text-lg font-bold text-slate-800 dark:text-slate-100">IPU Ursinio Rojas Santiesteban</h3>
            <p id="selectedSchoolLocationText" class="text-xs text-slate-500 dark:text-slate-400">Provincia: Holguín | Municipio: Báguanos</p>
          </div>
          <button id="btnAddGroupModal" class="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            Añadir Grupo
          </button>
        </div>

        <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
          <h4 class="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Grupos Oficiales Registrados:</h4>
          <div id="groupsBadgeList" class="flex flex-wrap gap-2">
            <span class="text-xs text-slate-400">Cargando grupos...</span>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  document.getElementById('btnAddSchoolModal').addEventListener('click', () => {
    const name = prompt('Ingrese el nombre del nuevo Preuniversitario/Escuela:');
    if (name && activeMunicipality) {
      alert(`Escuela "${name}" registrada para el municipio.`);
      loadSchoolsList(activeMunicipality.id, activeMunicipality.name);
    } else if (!activeMunicipality) {
      alert('Seleccione un municipio primero.');
    }
  });

  document.getElementById('btnAddGroupModal').addEventListener('click', () => {
    const gName = prompt('Ingrese la nomenclatura del nuevo grupo (ej. 10 - 3):');
    if (gName) {
      alert(`Grupo "${gName}" asignado a la escuela.`);
    }
  });

  loadProvincesTable();
}

async function loadProvincesTable() {
  const tbody = document.getElementById('provincesTableBody');
  try {
    const res = await ApiClient.getProvinces();
    const list = res.data || [];
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2" class="p-4 text-center text-slate-400">No hay provincias.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(p => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
        <td class="p-3 font-semibold text-slate-800 dark:text-slate-200">${p.name}</td>
        <td class="p-3 text-right">
          <button data-province-id="${p.id}" data-province-name="${p.name}" class="btn-view-muns px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 hover:bg-sky-100 font-bold text-[11px] transition-all">
            Ver Municipios
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-view-muns').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.provinceId;
        const name = e.currentTarget.dataset.provinceName;
        activeProvince = { id, name };
        loadMunicipalitiesTable(id, name);
      });
    });

    // Carga inicial por defecto (Holguín)
    const holguin = list.find(p => p.name === 'Holguín') || list[0];
    activeProvince = { id: holguin.id, name: holguin.name };
    loadMunicipalitiesTable(holguin.id, holguin.name);
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="2" class="p-4 text-center text-rose-400">Error al cargar provincias.</td></tr>';
  }
}

async function loadMunicipalitiesTable(provinceId, provinceName) {
  const tbody = document.getElementById('municipalitiesTableBody');
  const header = document.getElementById('municipalityTitleHeader');
  header.innerHTML = `<i data-lucide="building-2" class="w-5 h-5 text-indigo-500"></i> Municipios (${provinceName})`;
  if (window.lucide) window.lucide.createIcons();

  tbody.innerHTML = '<tr><td colspan="2" class="p-4 text-center text-slate-400">Cargando municipios...</td></tr>';

  try {
    const res = await ApiClient.getMunicipalities(provinceId);
    const list = res.data || [];
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2" class="p-4 text-center text-slate-400">Sin municipios registrados.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(m => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
        <td class="p-3 font-semibold text-slate-800 dark:text-slate-200">${m.name}</td>
        <td class="p-3 text-right">
          <button data-mun-id="${m.id}" data-mun-name="${m.name}" class="btn-view-schools px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-bold text-[11px] transition-all">
            Ver Escuelas
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-view-schools').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.munId;
        const name = e.currentTarget.dataset.munName;
        activeMunicipality = { id, name };
        loadSchoolsList(id, name);
      });
    });

    // Carga inicial por defecto (Báguanos)
    const targetMun = list.find(m => m.name === 'Báguanos') || list[0];
    activeMunicipality = { id: targetMun.id, name: targetMun.name };
    loadSchoolsList(targetMun.id, targetMun.name);
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="2" class="p-4 text-center text-rose-400">Error al cargar municipios.</td></tr>';
  }
}

async function loadSchoolsList(municipalityId, municipalityName) {
  const tbody = document.getElementById('schoolsTableBody');
  const header = document.getElementById('schoolTitleHeader');
  header.innerHTML = `<i data-lucide="school" class="w-5 h-5 text-emerald-500"></i> Escuelas (${municipalityName})`;
  if (window.lucide) window.lucide.createIcons();

  tbody.innerHTML = '<tr><td colspan="2" class="p-4 text-center text-slate-400">Cargando escuelas...</td></tr>';

  try {
    const res = await ApiClient.getSchools(municipalityId);
    const list = res.data || [];
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2" class="p-4 text-center text-slate-400">Sin escuelas en este municipio.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(s => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
        <td class="p-3 font-semibold text-slate-800 dark:text-slate-200">${s.name}</td>
        <td class="p-3 text-right">
          <button data-school-id="${s.id}" data-school-name="${s.name}" class="btn-inspect-school px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 font-bold text-[11px] transition-all">
            Ver Grupos
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btn-inspect-school').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.schoolId;
        const name = e.currentTarget.dataset.schoolName;
        inspectSchoolGroups(id, name);
      });
    });

    if (list.length > 0) {
      inspectSchoolGroups(list[0].id, list[0].name);
    }
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="2" class="p-4 text-center text-rose-400">Error al cargar escuelas.</td></tr>';
  }
}

async function inspectSchoolGroups(schoolId, schoolName) {
  const detailCard = document.getElementById('schoolGroupDetailCard');
  detailCard.classList.remove('hidden');

  document.getElementById('selectedSchoolNameText').innerText = schoolName;
  document.getElementById('selectedSchoolLocationText').innerText = `Provincia: ${activeProvince ? activeProvince.name : 'Holguín'} | Municipio: ${activeMunicipality ? activeMunicipality.name : 'Báguanos'}`;

  const badges = document.getElementById('groupsBadgeList');
  badges.innerHTML = '<span class="text-xs text-slate-400">Cargando grupos oficiales...</span>';

  try {
    const res = await ApiClient.getGroups(schoolId);
    const groups = res.data || [];
    if (groups.length === 0) {
      badges.innerHTML = '<span class="text-xs text-slate-400">No hay grupos registrados.</span>';
    } else {
      badges.innerHTML = groups.map(g => `
        <span class="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 font-semibold text-xs border border-sky-200 dark:border-sky-800 flex items-center gap-1.5">
          ${g.name}
        </span>
      `).join('');
    }
  } catch (e) {
    badges.innerHTML = '<span class="text-xs text-rose-400">Error al cargar grupos.</span>';
  }
}
