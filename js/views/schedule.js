/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: schedule.js
 * Versión: v1.0.0
 * Descripción: Editor Dinámico de Horarios Escolares con matriz de 16 turnos.
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { ApiClient } from '../api.js';

const SHIFT_LABELS = [
  'CI', 'Turno 1', 'Descanso', 'Turno 2', 'Descanso', 'Turno 3', 'Merienda',
  'Turno 4', 'Descanso', 'Turno 5', 'Almuerzo', 'Turno 6', 'Descanso',
  'Turno 7', 'Descanso', 'Turno 8'
];

const OFFICIAL_TIME_RANGES = [
  '07:50 - 08:00', '08:00 - 08:45', '08:45 - 08:50', '08:50 - 09:35',
  '09:35 - 09:40', '09:40 - 10:25', '10:25 - 10:50', '10:50 - 11:35',
  '11:35 - 11:40', '11:40 - 12:25', '12:25 - 13:25', '13:25 - 14:10',
  '14:10 - 14:15', '14:15 - 15:00', '15:00 - 15:05', '15:05 - 15:50'
];

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

let currentSchoolId = 'f4a234a1-b7aa-40d6-b217-b7b4afd70c3a'; // Escuela por defecto
let currentGroup = '10 - 1';
let currentMatrix = Array(16).fill(null).map(() => Array(5).fill('?'));

export async function renderScheduleEditor(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Editor Dinámico de Horarios</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Administra los turnos, recesos y materias de cada grupo en tiempo real</p>
        </div>
        <div class="flex items-center gap-3">
          <button id="btnSaveSchedule" class="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2">
            <i data-lucide="save" class="w-4 h-4"></i>
            Guardar Cambios
          </button>
        </div>
      </div>

      <!-- Selectores de Escuela y Grupo -->
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Escuela Seleccionada</label>
          <select id="selectSchool" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="f4a234a1-b7aa-40d6-b217-b7b4afd70c3a">IPVCE Mártires de Humboldt</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Grupo Escolar</label>
          <select id="selectGroup" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="10 - 1">10 - 1</option>
            <option value="10 - 2">10 - 2</option>
            <option value="11 - 1">11 - 1</option>
            <option value="11 - 2">11 - 2</option>
            <option value="12 - 1">12 - 1</option>
            <option value="12 - 2">12 - 2</option>
          </select>
        </div>
      </div>

      <!-- Matriz Interactiva de Horario -->
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <th class="p-3 w-28">Turno</th>
              <th class="p-3 w-36">Duración</th>
              <th class="p-3">Lunes</th>
              <th class="p-3">Martes</th>
              <th class="p-3">Miércoles</th>
              <th class="p-3">Jueves</th>
              <th class="p-3">Viernes</th>
            </tr>
          </thead>
          <tbody id="scheduleTableBody" class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr><td colspan="7" class="p-8 text-center text-slate-400">Cargando horario...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Listeners de cambio de grupo y guardado
  document.getElementById('selectGroup').addEventListener('change', (e) => {
    currentGroup = e.target.value;
    loadScheduleData();
  });

  document.getElementById('btnSaveSchedule').addEventListener('click', saveScheduleData);

  loadScheduleData();
}

async function loadScheduleData() {
  const tbody = document.getElementById('scheduleTableBody');
  tbody.innerHTML = '<tr><td colspan="7" class="p-8 text-center text-slate-400">Cargando datos del servidor...</td></tr>';

  try {
    const res = await ApiClient.getSchedule(currentGroup, currentSchoolId);
    const rows = res.data || [];

    currentMatrix = Array(16).fill(null).map(() => Array(5).fill('?'));

    rows.forEach(r => {
      const shiftIdx = r.shift >= 0 && r.shift < 16 ? r.shift : -1;
      const dayIdx = getDayIndex(r.day);
      if (shiftIdx >= 0 && dayIdx >= 0) {
        currentMatrix[shiftIdx][dayIdx] = r.subject || '?';
      }
    });

    renderTableRows();
  } catch (e) {
    console.error('Error al cargar horario:', e);
    renderTableRows();
  }
}

function renderTableRows() {
  const tbody = document.getElementById('scheduleTableBody');
  tbody.innerHTML = SHIFT_LABELS.map((label, r) => {
    const isBreak = (r === 0 || r === 2 || r === 4 || r === 6 || r === 8 || r === 10 || r === 12 || r === 14);
    const rowBg = isBreak ? 'bg-slate-50/50 dark:bg-slate-900/30' : '';

    return `
      <tr class="${rowBg} hover:bg-sky-50/30 dark:hover:bg-sky-950/20 transition-colors">
        <td class="p-3 font-semibold text-slate-700 dark:text-slate-300">${label}</td>
        <td class="p-3 text-xs font-mono text-slate-500 dark:text-slate-400">${OFFICIAL_TIME_RANGES[r]}</td>
        ${DAYS.map((_, d) => {
          const val = currentMatrix[r][d] || '?';
          return `
            <td class="p-1">
              <input type="text" data-row="${r}" data-col="${d}" value="${val}"
                class="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-bold text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase transition-all" />
            </td>
          `;
        }).join('')}
      </tr>
    `;
  }).join('');

  // Listener para edición directa de celdas
  tbody.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', (e) => {
      const r = parseInt(e.target.dataset.row);
      const d = parseInt(e.target.dataset.col);
      currentMatrix[r][d] = e.target.value.toUpperCase().trim();
    });
  });
}

function getDayIndex(day) {
  if (!day) return -1;
  const d = day.trim().toUpperCase();
  if (d.startsWith('L')) return 0;
  if (d.startsWith('MAR') || d === 'M') return 1;
  if (d.startsWith('MIÉR') || d.startsWith('MIER') || d === 'X') return 2;
  if (d.startsWith('J')) return 3;
  if (d.startsWith('V')) return 4;
  return -1;
}

async function saveScheduleData() {
  const btn = document.getElementById('btnSaveSchedule');
  btn.disabled = true;
  btn.innerText = 'Guardando...';

  try {
    const promises = [];
    for (let r = 0; r < 16; r++) {
      for (let d = 0; d < 5; d++) {
        const entry = {
          group: currentGroup,
          shift: r,
          timeRange: OFFICIAL_TIME_RANGES[r],
          day: DAYS[d],
          subject: currentMatrix[r][d] || '?',
          schoolId: currentSchoolId
        };
        promises.push(ApiClient.upsertSchedule(entry));
      }
    }

    await Promise.all(promises);
    alert('¡Horario guardado exitosamente!');
  } catch (e) {
    alert('Error al guardar horario: ' + e.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Guardar Cambios';
    if (window.lucide) window.lucide.createIcons();
  }
}
