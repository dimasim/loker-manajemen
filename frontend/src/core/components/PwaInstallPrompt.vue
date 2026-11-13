<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Download, X } from 'lucide-vue-next';

const deferredPrompt = ref<any>(null);
const showPrompt = ref(false);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showPrompt.value = true;
  });

  window.addEventListener('appinstalled', () => {
    showPrompt.value = false;
    deferredPrompt.value = null;
  });
});

const installPwa = async () => {
  if (!deferredPrompt.value) return;
  deferredPrompt.value.prompt();
  const { outcome } = await deferredPrompt.value.userChoice;
  if (outcome === 'accepted') {
    showPrompt.value = false;
  }
  deferredPrompt.value = null;
};

const dismiss = () => {
  showPrompt.value = false;
};
</script>

<template>
  <div
    v-if="showPrompt"
    class="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 rounded-2xl shadow-xl p-4 flex items-start space-x-3 transition-all duration-300 animate-bounce-subtle"
  >
    <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
      <Download class="w-5 h-5" />
    </div>

    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-100">
        Install Aplikasi Loker Tracker
      </h4>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
        Pasang di layar HP / Desktop kamu agar akses lebih cepat & bisa dibuka offline.
      </p>

      <div class="flex items-center space-x-2 mt-3">
        <button
          @click="installPwa"
          class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
        >
          Install Sekarang
        </button>
        <button
          @click="dismiss"
          class="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
        >
          Nanti Saja
        </button>
      </div>
    </div>

    <button
      @click="dismiss"
      class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1"
      title="Tutup"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</template>
