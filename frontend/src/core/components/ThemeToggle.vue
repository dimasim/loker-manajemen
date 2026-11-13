<script setup lang="ts">
import { useThemeStore } from '../stores/theme.store';
import { Sun, Moon } from 'lucide-vue-next';

const themeStore = useThemeStore();
</script>

<template>
  <button
    @click="themeStore.toggleTheme"
    type="button"
    class="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
    :title="themeStore.isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'"
  >
    <Sun v-if="themeStore.isDark" class="w-4 h-4 text-amber-400 transition transform rotate-0 hover:rotate-45" />
    <Moon v-else class="w-4 h-4 text-slate-600 transition transform rotate-0 hover:-rotate-12" />
  </button>
</template>

