import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './core/router';
import { useThemeStore } from './core/stores/theme.store';
import { registerSW } from 'virtual:pwa-register';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Inisialisasi tema Dark/Light
const themeStore = useThemeStore();
themeStore.initTheme();

// Inisialisasi Service Worker PWA (Auto Update)
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] Versi baru tersedia, siap di-update otomatis.');
  },
  onOfflineReady() {
    console.log('[PWA] Aplikasi siap dijalankan dalam mode offline!');
  },
});

app.mount('#app');
