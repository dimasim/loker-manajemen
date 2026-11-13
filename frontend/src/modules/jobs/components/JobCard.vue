<script setup lang="ts">
import { JobApplication, ApplicationStatus } from '../types/job.types';
import { ExternalLink, Building2, MapPin, DollarSign, Calendar, ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
  job: JobApplication;
}>();

const emit = defineEmits<{
  (e: 'select', job: JobApplication): void;
  (e: 'moveStatus', id: string, newStatus: ApplicationStatus): void;
}>();

const formatCurrency = (val?: string | number | null) => {
  if (!val) return null;
  const num = typeof val === 'string' ? parseFloat(val) : val;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
};

const workTypeColors: Record<string, string> = {
  REMOTE: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  HYBRID: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  ON_SITE: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800',
};
</script>

<template>
  <div
    @click="emit('select', job)"
    class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
  >
    <!-- Top Row: Company & External Link -->
    <div class="flex items-start justify-between gap-2 mb-2">
      <div class="flex items-center space-x-1.5 min-w-0">
        <Building2 class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span class="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
          {{ job.companyName }}
        </span>
      </div>

      <a
        v-if="job.jobUrl"
        :href="job.jobUrl"
        target="_blank"
        rel="noopener noreferrer"
        @click.stop
        class="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        title="Buka Link Loker Asli"
      >
        <ExternalLink class="w-3.5 h-3.5" />
      </a>
    </div>

    <!-- Job Position -->
    <h4 class="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-3">
      {{ job.position }}
    </h4>

    <!-- Tags Row -->
    <div class="flex flex-wrap items-center gap-1.5 mb-3">
      <!-- WorkType Badge -->
      <span
        class="text-[10px] font-semibold px-2 py-0.5 rounded-md border"
        :class="workTypeColors[job.workType] || 'bg-slate-100 text-slate-700'"
      >
        {{ job.workType }}
      </span>

      <!-- Platform Badge -->
      <span
        v-if="job.platform"
        class="text-[10px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50"
      >
        {{ job.platform.name }}
      </span>

      <!-- Location Badge -->
      <span
        v-if="job.location"
        class="inline-flex items-center text-[10px] text-slate-500 dark:text-slate-400 px-1.5 py-0.5"
      >
        <MapPin class="w-2.5 h-2.5 mr-0.5" />
        {{ job.location }}
      </span>
    </div>

    <!-- Salary & Date Info -->
    <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
      <div v-if="job.expectedSalary" class="flex items-center font-medium text-emerald-600 dark:text-emerald-400">
        <DollarSign class="w-3 h-3 mr-0.5" />
        <span>{{ formatCurrency(job.expectedSalary) }}</span>
      </div>
      <div v-else class="text-[11px] text-slate-400">
        Gaji belum dicatat
      </div>

      <div v-if="job.appliedDate || job.createdAt" class="flex items-center text-[11px] text-slate-400">
        <Calendar class="w-3 h-3 mr-1" />
        <span>{{ formatDate(job.appliedDate || job.createdAt) }}</span>
      </div>
    </div>

    <!-- Active Interviews Indicator -->
    <div
      v-if="job.interviews && job.interviews.length > 0"
      class="mt-2 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800/60 flex items-center justify-between"
    >
      <span>📅 {{ job.interviews.length }} Jadwal Interview</span>
      <ChevronRight class="w-3 h-3" />
    </div>
  </div>
</template>

