<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppLayout from '../../../core/layouts/AppLayout.vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import apiClient from '../../../core/api/api.client';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-vue-next';

const authStore = useAuthStore();
const stats = ref<Record<string, number>>({});
const isLoading = ref<boolean>(true);

const fetchStats = async () => {
  try {
    const res = await apiClient.get('/jobs/stats');
    if (res.data?.data?.stats) {
      stats.value = res.data.data.stats;
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchStats();
});
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-indigo-100 mb-3 border border-white/10">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Job Tracker Pelamar</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Halo, {{ authStore.userFullName }}! 👋
          </h1>
          <p class="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
            Anda berhasil login dengan akun pelamar. Sesi dan preferensi tema (Dark/Light) tersimpan otomatis.
          </p>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Lamaran</div>
          <div class="text-2xl font-black text-slate-800 dark:text-white">
            {{ Object.values(stats).reduce((a, b) => a + b, 0) }}
          </div>
          <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Tersimpan di Akun Anda</div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Terkirim (Applied)</div>
          <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {{ stats['APPLIED'] || 0 }}
          </div>
          <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Menunggu Review HR</div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Wawancara</div>
          <div class="text-2xl font-black text-amber-600 dark:text-amber-400">
            {{ (stats['INTERVIEW_HR'] || 0) + (stats['INTERVIEW_USER'] || 0) }}
          </div>
          <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Tahap Interview</div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Offering / Diterima</div>
          <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {{ (stats['OFFERING'] || 0) + (stats['ACCEPTED'] || 0) }}
          </div>
          <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Tahap Negosiasi & Deal</div>
        </div>
      </div>

      <!-- Step 5 Preparation Box -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors duration-200">
        <div class="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-2">
          <CheckCircle2 class="w-5 h-5" />
          <h2 class="text-lg font-bold text-slate-800 dark:text-white">Dark / Light Mode Berhasil Ditambahkan! 🌓</h2>
        </div>
        <p class="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-relaxed">
          Tombol toggle tema (Matahari ☀️ / Bulan 🌙) sekarang tersedia di navbar atas dan halaman login/register. Preferensi tema Anda otomatis tersimpan di <code>localStorage</code> dan mengingat pilihan Anda saat membuka web lagi.
        </p>

        <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div class="text-xs text-slate-500 dark:text-slate-400">
            Status Akun: <strong class="text-slate-800 dark:text-white">{{ authStore.user?.email }}</strong> &bull; Role: <strong class="text-indigo-600 dark:text-indigo-400">{{ authStore.userRole }}</strong>
          </div>
          <div class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1">
            <span>Next: Langkah 5 UI Fungsional (Kanban Board)</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
