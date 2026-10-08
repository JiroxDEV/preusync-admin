/**
 * ============================================================================
 * Proyecto: PreuSync Admin Panel
 * Archivo: app.js
 * Versión: v1.0.0
 * Descripción: Enrutador principal SPA, navegación lateral y gestión de temas.
 * Autor: JiroxDEV
 * Licensed under the GNU Affero General Public License v3
 * ============================================================================
 */

import { AuthManager } from './auth.js';
import { CONFIG } from './config.js';
import { renderDashboard } from './views/dashboard.js';
import { renderScheduleEditor } from './views/schedule.js';
import { renderSchoolsManager } from './views/schools.js';
import { renderContentManager } from './views/content.js';
import { renderUsersManager } from './views/users.js';
import { renderReportsManager } from './views/reports.js';

class App {
  constructor() {
    this.currentView = 'dashboard';
    this.init();
  }

  async init() {
    this.setupTheme();

    if (!AuthManager.isAuthenticated()) {
      this.renderLoginForm();
      return;
    }

    this.renderAdminLayout();
    this.bindNavigation();
    this.loadView('dashboard');
  }

  setupTheme() {
    const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
  }

  renderLoginForm() {
    const root = document.getElementById('app');
    root.innerHTML = `
      <div class="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div class="w-full max-w-md p-8 rounded-3xl bg-slate-800 border border-slate-700 shadow-2xl space-y-6 animate-fade-in">
          <div class="text-center space-y-2">
            <div class="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mx-auto mb-3">
              <i data-lucide="shield" class="w-6 h-6"></i>
            </div>
            <h1 class="text-2xl font-bold tracking-tight">PreuSync Admin</h1>
            <p class="text-xs text-slate-400">Inicia sesión con tu cuenta de administrador</p>
          </div>

          <form id="loginForm" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Usuario</label>
              <input type="text" id="loginUsername" placeholder="JiroxDEV" required
                class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm font-medium text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contraseña</label>
              <input type="password" id="loginPassword" placeholder="••••••••" required
                class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm font-medium text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>

            <div id="loginError" class="hidden p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs text-center font-medium"></div>

            <button type="submit" id="btnLoginSubmit"
              class="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-600/20">
              Acceder al Panel
            </button>
          </form>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const u = document.getElementById('loginUsername').value.trim();
      const p = document.getElementById('loginPassword').value.trim();
      const errBox = document.getElementById('loginError');
      const btn = document.getElementById('btnLoginSubmit');

      errBox.classList.add('hidden');
      btn.disabled = true;
      btn.innerText = 'Verificando...';

      try {
        await AuthManager.login(u, p);
        this.init();
      } catch (err) {
        errBox.innerText = err.message || 'Credenciales inválidas';
        errBox.classList.remove('hidden');
        btn.disabled = false;
        btn.innerText = 'Acceder al Panel';
      }
    });
  }

  renderAdminLayout() {
    const root = document.getElementById('app');
    const user = AuthManager.getUser() || { username: 'Admin', role: 'admin' };

    root.innerHTML = `
      <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
        <!-- Sidebar Navigation -->
        <aside class="w-full md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700/60 flex-shrink-0 flex flex-col justify-between">
          <div>
            <!-- Brand -->
            <div class="p-6 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-sky-600/20">
                  P
                </div>
                <div>
                  <h2 class="font-bold text-base tracking-tight text-slate-800 dark:text-slate-100">PreuSync</h2>
                  <span class="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">Admin Panel</span>
                </div>
              </div>
            </div>

            <!-- Nav Links -->
            <nav class="p-4 space-y-1.5">
              <button data-view="dashboard" class="nav-item w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
                Dashboard
              </button>

              <button data-view="schedule" class="nav-item w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                <i data-lucide="calendar" class="w-5 h-5"></i>
                Editor de Horarios
              </button>

              <button data-view="schools" class="nav-item w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                <i data-lucide="school" class="w-5 h-5"></i>
                Escuelas y Grupos
              </button>

              <button data-view="content" class="nav-item w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                <i data-lucide="file-text" class="w-5 h-5"></i>
                Contenidos y Noticias
              </button>

              <button data-view="users" class="nav-item w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                <i data-lucide="users" class="w-5 h-5"></i>
                Usuarios y Roles
              </button>

              <button data-view="reports" class="nav-item w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50">
                <i data-lucide="shield-alert" class="w-5 h-5"></i>
                Moderación y Bugs
              </button>
            </nav>
          </div>

          <!-- User Footer -->
          <div class="p-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="w-8 h-8 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                ${user.username ? user.username.charAt(0).toUpperCase() : 'A'}
              </div>
              <div class="truncate">
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">${user.fullName || user.username}</p>
                <p class="text-[10px] font-semibold text-sky-600 dark:text-sky-400 capitalize">${user.role}</p>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <button id="btnToggleTheme" class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors">
                <i data-lucide="moon" class="w-4 h-4"></i>
              </button>
              <button id="btnLogout" class="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors">
                <i data-lucide="log-out" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main id="mainContainer" class="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <!-- Views rendered dynamically -->
        </main>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    document.getElementById('btnToggleTheme').addEventListener('click', () => this.toggleTheme());
    document.getElementById('btnLogout').addEventListener('click', () => AuthManager.logout());
  }

  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.loadView(view);
      });
    });
  }

  loadView(viewName) {
    this.currentView = viewName;
    const main = document.getElementById('mainContainer');

    // Active Tab Styling
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.view === viewName) {
        item.classList.add('bg-sky-50', 'dark:bg-sky-950/50', 'text-sky-600', 'dark:text-sky-400', 'border', 'border-sky-200', 'dark:border-sky-800');
        item.classList.remove('text-slate-600', 'dark:text-slate-300');
      } else {
        item.classList.remove('bg-sky-50', 'dark:bg-sky-950/50', 'text-sky-600', 'dark:text-sky-400', 'border', 'border-sky-200', 'dark:border-sky-800');
        item.classList.add('text-slate-600', 'dark:text-slate-300');
      }
    });

    switch (viewName) {
      case 'dashboard': renderDashboard(main); break;
      case 'schedule': renderScheduleEditor(main); break;
      case 'schools': renderSchoolsManager(main); break;
      case 'content': renderContentManager(main); break;
      case 'users': renderUsersManager(main); break;
      case 'reports': renderReportsManager(main); break;
      default: renderDashboard(main); break;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
