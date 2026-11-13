<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppLayout from '../../../core/layouts/AppLayout.vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import { useJobStore } from '../../jobs/stores/job.store';
import JobKanbanView from '../../jobs/components/JobKanbanView.vue';
import JobTableView from '../../jobs/components/JobTableView.vue';
import CreateJobModal from '../../jobs/components/CreateJobModal.vue';
import JobDetailModal from '../../jobs/components/JobDetailModal.vue';
import {
  Plus,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Briefcase,
  Send,
  Calendar,
  Award,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const jobStore = useJobStore();

const showCreateModal = ref<boolean>(false);

onMounted(() => {
  jobStore.fetchAll();
});
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Top Metrics Overview -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <!-- Total Lamaran -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Loker</span>
            <div class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Briefcase class="w-4 h-4" />
            </div>
          </div>
          <div class="text-3xl font-black text-slate-800 dark:text-white">
            {{ jobStore.jobs.length }}
          </div>
          <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Dicatat di Akun Anda</div>
        </div>

        <!-- Terkirim (Applied) -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Terkirim</span>
            <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Send class="w-4 h-4" />
            </div>
          </div>
          <div class="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {{ jobStore.stats['APPLIED'] || 0 }}
          </div>
          <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Menunggu Review</div>
        </div>

        <!-- Interview -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Wawancara</span>
            <div class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Calendar class="w-4 h-4" />
            </div>
          </div>
          <div class="text-3xl font-black text-amber-600 dark:text-amber-400">
            {{ (jobStore.stats['INTERVIEW_HR'] || 0) + (jobStore.stats['INTERVIEW_USER'] || 0) }}
          </div>
          <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">HR & User Interview</div>
        </div>

        <!-- Offering / Accepted -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Offering & Deal</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award class="w-4 h-4" />
            </div>
          </div>
          <div class="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {{ (jobStore.stats['OFFERING'] || 0) + (jobStore.stats['ACCEPTED'] || 0) }}
          </div>
          <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Tahap Lolos & Diterima</div>
        </div>
      </div>

      <!-- Action & Filter Bar -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors duration-200">
        <!-- Search & Filter Controls -->
        <div class="flex flex-wrap items-center gap-3 flex-1">
          <!-- Search Bar -->
          <div class="relative flex-1 min-w-[240px]">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search class="w-4 h-4" />
            </div>
            <input
              v-model="jobStore.searchQuery"
              type="text"
              placeholder="Cari perusahaan, posisi, atau lokasi..."
              class="block w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <!-- WorkType Filter -->
          <select
            v-model="jobStore.filterWorkType"
            class="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="">Semua Tipe Kerja</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ON_SITE">On-Site</option>
          </select>
        </div>

        <!-- View Switcher & Add Job Button -->
        <div class="flex items-center space-x-3">
          <!-- Kanban vs Table Toggle -->
          <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              @click="jobStore.viewMode = 'kanban'"
              class="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
              :class="jobStore.viewMode === 'kanban' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'"
              title="Tampilan Papan Kanban"
            >
              <LayoutGrid class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Kanban</span>
            </button>

            <button
              @click="jobStore.viewMode = 'table'"
              class="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
              :class="jobStore.viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'"
              title="Tampilan Tabel"
            >
              <TableIcon class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Tabel</span>
            </button>
          </div>

          <!-- Add Job Button -->
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition"
          >
            <Plus class="w-4 h-4" />
            <span>Tambah Loker</span>
          </button>
        </div>
      </div>

      <!-- Main Workspace Views -->
      <div v-if="jobStore.isLoading" class="text-center py-16">
        <div class="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <div class="text-xs text-slate-500">Memuat data loker Anda...</div>
      </div>

      <div v-else>
        <!-- Kanban Board View -->
        <JobKanbanView
          v-if="jobStore.viewMode === 'kanban'"
          @openCreate="showCreateModal = true"
          @selectJob="jobStore.selectJob"
        />

        <!-- Table View -->
        <JobTableView
          v-else
          @selectJob="jobStore.selectJob"
        />
      </div>

      <!-- Modals -->
      <CreateJobModal
        v-if="showCreateModal"
        @close="showCreateModal = false"
        @created="jobStore.fetchAll"
      />

      <JobDetailModal
        v-if="jobStore.selectedJob"
        @close="jobStore.clearSelectedJob"
      />
    </div>
  </AppLayout>
</template>
