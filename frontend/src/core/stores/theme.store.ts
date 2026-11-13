import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref<boolean>(false);

  const applyTheme = (dark: boolean) => {
    isDark.value = dark;
    const root = document.documentElement;

    if (dark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
      localStorage.setItem('loker_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
      localStorage.setItem('loker_theme', 'light');
    }
  };

  const toggleTheme = () => {
    applyTheme(!isDark.value);
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem('loker_theme');
    if (savedTheme === 'dark') {
      applyTheme(true);
    } else if (savedTheme === 'light') {
      applyTheme(false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark);
    }
  };

  return {
    isDark,
    toggleTheme,
    applyTheme,
    initTheme,
  };
});
