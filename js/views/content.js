/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: content.js
 * Versión: v1.4.0
 * Descripción: Gestor de Contenidos con soporte completo para adjunción de imágenes
 *              en Noticias, Posts, Eventos y Efemérides.
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { ApiClient } from '../api.js';

let activeContentTab = 'news';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export async function renderContentManager(container) {
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Centro de Contenidos</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Administra Noticias, Publicaciones de Comunidad, Eventos y Efemérides con soporte de imágenes</p>
        </div>
      </div>

      <!-- Pestañas de Sub-Navegación -->
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-3 overflow-x-auto">
        <button data-content-tab="news" class="content-tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
          <i data-lucide="newspaper" class="w-4 h-4"></i>
          Noticias Destacadas
        </button>
        <button data-content-tab="posts" class="content-tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
          <i data-lucide="message-square" class="w-4 h-4"></i>
          Publicaciones de Comunidad
        </button>
        <button data-content-tab="events" class="content-tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
          <i data-lucide="calendar" class="w-4 h-4"></i>
          Eventos (Escolares y Externos)
        </button>
        <button data-content-tab="ephemerides" class="content-tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
          <i data-lucide="bookmark" class="w-4 h-4"></i>
          Efemérides Históricas
        </button>
      </div>

      <!-- Contenedor dinámico -->
      <div id="contentTabContainer" class="space-y-6">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  document.querySelectorAll('.content-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget.dataset.contentTab;
      activeContentTab = target;

      document.querySelectorAll('.content-tab-btn').forEach(b => {
        if (b.dataset.contentTab === target) {
          b.className = 'content-tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800';
        } else {
          b.className = 'content-tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
        }
      });

      loadActiveContentTab();
    });
  });

  loadActiveContentTab();
}

function loadActiveContentTab() {
  const container = document.getElementById('contentTabContainer');
  switch (activeContentTab) {
    case 'news': renderNewsTab(container); break;
    case 'posts': renderPostsTab(container); break;
    case 'events': renderEventsTab(container); break;
    case 'ephemerides': renderEphemeridesTab(container); break;
    default: renderNewsTab(container); break;
  }
}

// ==================== 1. PESTAÑA NOTICIAS ====================
async function renderNewsTab(container) {
  container.innerHTML = `
    <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
      <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <i data-lucide="plus-circle" class="w-5 h-5 text-purple-500"></i>
        Publicar Nueva Noticia Destacada
      </h2>
      <div class="space-y-3">
        <input type="text" id="newsHeadline" placeholder="Encabezado / Titular de la Noticia" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <textarea id="newsDetails" rows="3" placeholder="Detalles o descripción completa..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text" id="newsSource" placeholder="Fuente (ej. Dirección IPVCE)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <input type="text" id="newsUrl" placeholder="Enlace externo URL (opcional)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Imagen Adjunta de Portada (Opcional)</label>
          <input type="file" id="newsImageFile" accept="image/*" class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-950 dark:file:text-purple-300" />
        </div>

        <button id="btnPublishNews" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-sm">
          Enviar Noticia
        </button>
      </div>
    </div>

    <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <i data-lucide="list" class="w-5 h-5 text-purple-500"></i>
        Noticias Registradas
      </h3>
      <div id="newsListContainer" class="space-y-3">
        <div class="p-4 text-center text-slate-400 text-sm">Consultando noticias...</div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  document.getElementById('btnPublishNews').addEventListener('click', async () => {
    const headline = document.getElementById('newsHeadline').value.trim();
    const details = document.getElementById('newsDetails').value.trim();
    const source = document.getElementById('newsSource').value.trim() || 'PreuSync';
    const url = document.getElementById('newsUrl').value.trim() || 'https://preusync.com';
    const imageFileInput = document.getElementById('newsImageFile');

    if (!headline || !details) {
      alert('El titular y los detalles son obligatorios.');
      return;
    }

    let imageBase64 = '';
    if (imageFileInput && imageFileInput.files[0]) {
      try {
        imageBase64 = await fileToBase64(imageFileInput.files[0]);
      } catch (e) {}
    }

    try {
      await ApiClient.addNews({ headline, details, source, url, imageBase64 });
      alert('¡Noticia publicada con éxito!');
      document.getElementById('newsHeadline').value = '';
      document.getElementById('newsDetails').value = '';
      if (imageFileInput) imageFileInput.value = '';
      loadNewsList();
    } catch (e) {
      alert('Error al publicar noticia: ' + e.message);
    }
  });

  loadNewsList();
}

async function loadNewsList() {
  const container = document.getElementById('newsListContainer');
  try {
    const res = await ApiClient.getNewsRange(0, 20);
    const items = res.data || [];
    if (items.length === 0) {
      container.innerHTML = '<div class="p-4 text-center text-slate-400 text-sm">No hay noticias registradas.</div>';
    } else {
      container.innerHTML = items.map(n => `
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
          <h4 class="font-bold text-slate-800 dark:text-slate-200 text-sm">${n.headline}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400">${n.details}</p>
          <div class="flex items-center gap-3 pt-2 text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            <span>Fuente: ${n.source || 'PreuSync'}</span>
          </div>
        </div>
      `).join('');
    }
  } catch (e) {
    container.innerHTML = '<div class="p-4 text-center text-rose-400 text-sm">Error al cargar noticias.</div>';
  }
}

// ==================== 2. PESTAÑA PUBLICACIONES ====================
async function renderPostsTab(container) {
  container.innerHTML = `
    <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
      <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <i data-lucide="plus-circle" class="w-5 h-5 text-amber-500"></i>
        Crear Publicación Oficial (Como Admin)
      </h2>
      <div class="space-y-3">
        <input type="text" id="postTitle" placeholder="Título de la publicación" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500" />
        <textarea id="postDetails" rows="3" placeholder="Detalles / Contenido en Markdown..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>

        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Imagen Adjunta (Opcional)</label>
          <input type="file" id="postImageFile" accept="image/*" class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-amber-950 dark:file:text-amber-300" />
        </div>

        <button id="btnPublishPost" class="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-all shadow-sm">
          Publicar Post
        </button>
      </div>
    </div>

    <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <i data-lucide="message-square" class="w-5 h-5 text-amber-500"></i>
        Publicaciones de la Comunidad
      </h3>
      <div id="postsListContainer" class="space-y-3">
        <div class="p-4 text-center text-slate-400 text-sm">Consultando publicaciones...</div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  document.getElementById('btnPublishPost').addEventListener('click', async () => {
    const title = document.getElementById('postTitle').value.trim();
    const details = document.getElementById('postDetails').value.trim();
    const postFileInput = document.getElementById('postImageFile');

    if (!title || !details) {
      alert('El título y el contenido son obligatorios.');
      return;
    }

    let imageBase64 = '';
    if (postFileInput && postFileInput.files[0]) {
      try {
        imageBase64 = await fileToBase64(postFileInput.files[0]);
      } catch (e) {}
    }

    try {
      await ApiClient.addPost({ title, details, imageBase64 });
      alert('¡Publicación creada exitosamente!');
      document.getElementById('postTitle').value = '';
      document.getElementById('postDetails').value = '';
      if (postFileInput) postFileInput.value = '';
      loadPostsList();
    } catch (e) {
      alert('Error al crear publicación: ' + e.message);
    }
  });

  loadPostsList();
}

async function loadPostsList() {
  const container = document.getElementById('postsListContainer');
  try {
    const res = await ApiClient.getPostsRange(0, 20);
    const posts = res.data || [];
    if (posts.length === 0) {
      container.innerHTML = '<div class="p-4 text-center text-slate-400 text-sm">No hay publicaciones comunitarias.</div>';
    } else {
      container.innerHTML = posts.map(p => `
        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
          <h4 class="font-bold text-slate-800 dark:text-slate-200 text-sm">${p.title || p.details}</h4>
          <p class="text-xs text-slate-500 dark:text-slate-400">${p.details}</p>
          <div class="flex items-center gap-3 pt-2 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            <span>Autor: @${p.author || 'Usuario'}</span>
            <span>• Votos: ${p.score || 0}</span>
          </div>
        </div>
      `).join('');
    }
  } catch (e) {
    container.innerHTML = '<div class="p-4 text-center text-rose-400 text-sm">Error al cargar publicaciones.</div>';
  }
}

// ==================== 3. PESTAÑA EVENTOS ====================
async function renderEventsTab(container) {
  container.innerHTML = `
    <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
      <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <i data-lucide="plus-circle" class="w-5 h-5 text-sky-500"></i>
        Crear Nuevo Evento
      </h2>
      <div class="space-y-3">
        <input type="text" id="eventTitle" placeholder="Título del evento" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" />
        <textarea id="eventDetails" rows="2" placeholder="Detalles del evento..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"></textarea>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" id="eventDate" placeholder="Fecha (DD/MM/YYYY)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <input type="text" id="eventTime" placeholder="Hora (ej. 09:00 AM)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" />
          <input type="text" id="eventLocation" placeholder="Lugar (ej. Plaza Central)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select id="eventType" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="school">Evento Escolar</option>
            <option value="external">Evento Externo / Nacional</option>
          </select>
          <input type="text" id="eventSchoolId" value="f4a234a1-b7aa-40d6-b217-b7b4afd70c3a" placeholder="ID de Escuela" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Póster o Imagen del Evento (Opcional)</label>
          <input type="file" id="eventImageFile" accept="image/*" class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 dark:file:bg-sky-950 dark:file:text-sky-300" />
        </div>

        <button id="btnPublishEvent" class="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-all shadow-sm">
          Guardar Evento
        </button>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  document.getElementById('btnPublishEvent').addEventListener('click', async () => {
    const title = document.getElementById('eventTitle').value.trim();
    const details = document.getElementById('eventDetails').value.trim();
    const date = document.getElementById('eventDate').value.trim();
    const time = document.getElementById('eventTime').value.trim();
    const location = document.getElementById('eventLocation').value.trim();
    const eventType = document.getElementById('eventType').value;
    const schoolId = document.getElementById('eventSchoolId').value.trim();
    const eventFileInput = document.getElementById('eventImageFile');

    if (!title || !details || !date || !time || !location) {
      alert('Todos los campos del evento son obligatorios.');
      return;
    }

    let imageBase64 = '';
    if (eventFileInput && eventFileInput.files[0]) {
      try {
        imageBase64 = await fileToBase64(eventFileInput.files[0]);
      } catch (e) {}
    }

    try {
      await ApiClient.addEvent({ title, details, date, time, location, eventType, schoolId, imageBase64 });
      alert('¡Evento agendado con éxito!');
      document.getElementById('eventTitle').value = '';
      document.getElementById('eventDetails').value = '';
      if (eventFileInput) eventFileInput.value = '';
    } catch (e) {
      alert('Error al agendar evento: ' + e.message);
    }
  });
}

// ==================== 4. PESTAÑA EFEMÉRIDES ====================
async function renderEphemeridesTab(container) {
  container.innerHTML = `
    <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
      <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <i data-lucide="plus-circle" class="w-5 h-5 text-indigo-500"></i>
        Añadir Efeméride Histórica
      </h2>
      <div class="space-y-3">
        <input type="text" id="ephTitle" placeholder="Título del hecho histórico" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <textarea id="ephDetails" rows="2" placeholder="Reseña o detalles del acontecimiento..." class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="number" id="ephDay" min="1" max="31" value="${new Date().getDate()}" placeholder="Día (1-31)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="number" id="ephMonth" min="1" max="12" value="${new Date().getMonth() + 1}" placeholder="Mes (1-12)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="number" id="ephYear" placeholder="Año histórico (ej. 1868)" class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Imagen Histórica Adjunta (Opcional)</label>
          <input type="file" id="ephImageFile" accept="image/*" class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-950 dark:file:text-indigo-300" />
        </div>

        <button id="btnPublishEph" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm">
          Guardar Efeméride
        </button>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  document.getElementById('btnPublishEph').addEventListener('click', async () => {
    const title = document.getElementById('ephTitle').value.trim();
    const details = document.getElementById('ephDetails').value.trim();
    const day = parseInt(document.getElementById('ephDay').value);
    const month = parseInt(document.getElementById('ephMonth').value);
    const year = document.getElementById('ephYear').value.trim();
    const ephFileInput = document.getElementById('ephImageFile');

    if (!title || !day || !month) {
      alert('El título, el día y el mes son obligatorios.');
      return;
    }

    let imageBase64 = '';
    if (ephFileInput && ephFileInput.files[0]) {
      try {
        imageBase64 = await fileToBase64(ephFileInput.files[0]);
      } catch (e) {}
    }

    try {
      await ApiClient.addEphemeris({ title, details, day, month, year, imageBase64, importance: 5 });
      alert('¡Efeméride registrada con éxito!');
      document.getElementById('ephTitle').value = '';
      document.getElementById('ephDetails').value = '';
      if (ephFileInput) ephFileInput.value = '';
    } catch (e) {
      alert('Error al registrar efeméride: ' + e.message);
    }
  });
}
