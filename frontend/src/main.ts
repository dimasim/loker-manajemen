import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './core/router';
import { useThemeStore } from './core/stores/theme.store';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Inisialisasi tema Dark/Light
const themeStore = useThemeStore();
themeStore.initTheme();

app.mount('#app');
