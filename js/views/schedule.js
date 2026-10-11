/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: schedule.js
 * Versión: v1.2.0
 * Descripción: Editor Dinámico de Horarios Escolares con leyenda interactiva
 *              basada en la especificación oficial de 'Horario escolar.ods'.
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { ApiClient } from '../api.js';

const SHIFT_LABELS = [
  'CI', 'Turno 1 (T1)', 'Descanso (D5)', 'Turno 2 (T2)', 'Descanso (D5)', 'Turno 3 (T3)', 'Receso (R)',
  'Turno 4 (T4)', 'Descanso (D5)', 'Turno 5 (T5)', 'Almuerzo (AZ)', 'Turno 6 (T6)', 'Descanso (D5)',
  'Turno 7 (T7)', 'Descanso (D5)', 'Turno 8 (T8)'
];

const OFFICIAL_TIME_RANGES = [
  '07:50 - 08:00', '08:00 - 08:45', '08:45 - 08:50', '08:50 - 09:35',
  '09:35 - 09:40', '09:40 - 10:25', '10:25 - 10:50', '10:50 - 11:35',
  '11:35 - 11:40', '11:40 - 12:25', '12:25 - 13:25', '13:25 - 14:10',
  '14:10 - 14:15', '14:15 - 15:00', '15:00 - 15:05', '15:05 - 15:50'
];

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

let currentSchoolId = 'f4a234a1-b7aa-40d6-b217-b7b4afd70c3a';
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
            <option value="f4a234a1-b7aa-40d6-b217-b7b4afd70c3a">Cargando escuelas...</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Grupo Escolar</label>
          <select id="selectGroup" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="10 - 1">Cargando grupos...</option>
          </select>
        </div>
      </div>

      <!-- Leyenda de Nomenclatura y Asignaturas -->
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <div id="btnToggleLegend" class="flex items-center justify-between cursor-pointer">
          <div class="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
            <i data-lucide="book-open" class="w-4 h-4"></i>
            <span>Leyenda Oficial de Asignaturas y Nomenclatura</span>
          </div>
          <span class="text-xs text-slate-400">Mostrar / Ocultar Leyenda ▼</span>
        </div>

        <div id="legendContent" class="space-y-4 text-xs border-t border-slate-100 dark:border-slate-700/60 pt-3">
          <!-- Nomenclatura de Turnos y Pausas -->
          <div>
            <h4 class="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Nomenclatura de Jornada y Pausas:</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <span class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"><strong>CI:</strong> Conversación Inicial</span>
              <span class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"><strong>T1 - T8:</strong> Turno 1 a Turno 8</span>
              <span class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"><strong>D5 (-):</strong> Descanso (5 min)</span>
              <span class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"><strong>R (—):</strong> Receso Merienda</span>
              <span class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"><strong>AZ (///):</strong> Almuerzo</span>
              <span class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"><strong>?:</strong> Sin turno definido</span>
            </div>
          </div>

          <!-- Glosario de Asignaturas Oficiales -->
          <div>
            <h4 class="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Abreviaturas de Asignaturas Oficiales:</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>M:</strong> Matemáticas</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>LL:</strong> Literatura y Lengua</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>HC:</strong> Historia de Cuba</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>H:</strong> Historia Contemporánea</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>B:</strong> Biología</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>CP:</strong> Cultura Política</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>DC:</strong> Defensa Civil</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>IF:</strong> Informática</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>I:</strong> Inglés</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>Q:</strong> Química</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>EF:</strong> Educación Física</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>F:</strong> Física</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>G:</strong> Geografía Regional</span>
              <span class="p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 font-medium"><strong>DR:</strong> Debate y Reflexión</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Matriz Interactiva de Horario -->
      <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <th class="p-3 w-36">Turno / Etapa</th>
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

  document.getElementById('btnToggleLegend').addEventListener('click', () => {
    document.getElementById('legendContent').classList.toggle('hidden');
  });

  document.getElementById('selectSchool').addEventListener('change', (e) => {
    currentSchoolId = e.target.value;
    loadGroupsForSchool(currentSchoolId);
  });

  document.getElementById('selectGroup').addEventListener('change', (e) => {
    currentGroup = e.target.value;
    loadScheduleData();
  });

  document.getElementById('btnSaveSchedule').addEventListener('click', saveScheduleData);

  loadSchools();
}

async function loadSchools() {
  const schoolSel = document.getElementById('selectSchool');
  try {
    const res = await ApiClient.getSchools('eba718c1-f696-4a98-91cc-2cd37b9e405a');
    const schools = res.data || [];
    if (schools.length > 0) {
      schoolSel.innerHTML = schools.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
      currentSchoolId = schools[0].id;
    } else {
      schoolSel.innerHTML = '<option value="f4a234a1-b7aa-40d6-b217-b7b4afd70c3a">IPVCE Mártires de Humboldt</option>';
      currentSchoolId = 'f4a234a1-b7aa-40d6-b217-b7b4afd70c3a';
    }
  } catch (e) {
    schoolSel.innerHTML = '<option value="f4a234a1-b7aa-40d6-b217-b7b4afd70c3a">IPVCE Mártires de Humboldt</option>';
    currentSchoolId = 'f4a234a1-b7aa-40d6-b217-b7b4afd70c3a';
  }
  loadGroupsForSchool(currentSchoolId);
}

async function loadGroupsForSchool(schoolId) {
  const groupSel = document.getElementById('selectGroup');
  if (!groupSel) return;
  groupSel.innerHTML = '<option value="">Cargando grupos...</option>';
  try {
    const res = await ApiClient.getGroups(schoolId);
    const groups = res.data || [];
    if (groups.length === 0) {
      groupSel.innerHTML = '<option value="">Sin grupos en BD</option>';
      return;
    }
    groupSel.innerHTML = groups.map(g => `<option value="${g.name}">${g.name}</option>`).join('');
    currentGroup = groups[0].name;
    loadScheduleData();
  } catch (e) {
    if (groupSel) groupSel.innerHTML = '<option value="10 - 1">10 - 1</option><option value="10 - 2">10 - 2</option><option value="11 - 1">11 - 1</option><option value="11 - 2">11 - 2</option><option value="12 - 1">12 - 1</option><option value="12 - 2">12 - 2</option>';
    currentGroup = '10 - 1';
    loadScheduleData();
  }
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
