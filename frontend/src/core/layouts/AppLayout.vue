<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../modules/auth/stores/auth.store';
import ThemeToggle from '../components/ThemeToggle.vue';
import { Briefcase, LogOut, UserCircle } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'Login' });
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col">
    <!-- Navbar Top -->
    <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo / Brand -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
            <Briefcase class="w-5 h-5" />
          </div>
          <div>
            <span class="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Job Tracker</span>
            <span class="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
              Pelamar
            </span>
          </div>
        </div>

        <!-- Controls: Theme Toggle, User Profile & Logout -->
        <div class="flex items-center space-x-3 sm:space-x-4">
          <!-- Dark / Light Mode Toggle Button -->
          <ThemeToggle />

          <div class="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

          <div class="flex items-center space-x-2 text-right">
            <UserCircle class="w-8 h-8 text-slate-400 dark:text-slate-500" />
            <div class="hidden sm:block text-left">
              <div class="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {{ authStore.userFullName }}
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <span>{{ authStore.user?.email }}</span>
                <span class="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {{ authStore.userRole }}
                </span>
              </div>
            </div>
          </div>

          <div class="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

          <button
            @click="handleLogout"
            class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg border border-rose-200 dark:border-rose-900/50 transition"
            title="Keluar dari Akun"
          >
            <LogOut class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Page Content Slot -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors duration-200">
      Personal Job Application Tracker &bull; Vue 3.5 + Express + PostgreSQL
    </footer>
  </div>
</template>
