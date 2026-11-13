<script setup lang="ts">
import { useJobStore } from '../stores/job.store';
import { JobApplication, ApplicationStatus } from '../types/job.types';
import { ExternalLink, Building2, Calendar, MapPin, DollarSign, Trash2 } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'selectJob', job: JobApplication): void;
}>();

const jobStore = useJobStore();

const statusLabels: Record<ApplicationStatus, { text: string; class: string }> = {
  WISHLIST: { text: '📌 Wishlist', class: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  APPLIED: { text: '📤 Terkirim', class: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
  TEST: { text: '📝 Tes Koding', class: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300' },
  INTERVIEW_HR: { text: '🗣️ Wawancara HR', class: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  INTERVIEW_USER: { text: '👥 Wawancara User', class: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
  OFFERING: { text: '🎉 Offering', class: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
  ACCEPTED: { text: '🚀 Diterima', class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  REJECTED: { text: '❌ Ditolak', class: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
  WITHDRAWN: { text: '⛔ Batal', class: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
};

const formatCurrency = (val?: string | number | null) => {
  if (!val) return '-';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th class="py-3.5 px-4">Perusahaan & Posisi</th>
            <th class="py-3.5 px-4">Platform</th>
            <th class="py-3.5 px-4">Tipe Kerja</th>
            <th class="py-3.5 px-4">Gaji</th>
            <th class="py-3.5 px-4">Status Alur</th>
            <th class="py-3.5 px-4">Tanggal</th>
            <th class="py-3.5 px-4 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
          <tr
            v-for="job in jobStore.filteredJobs"
            :key="job.id"
            @click="emit('selectJob', job)"
            class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition"
          >
            <!-- Company & Position -->
            <td class="py-3.5 px-4">
              <div class="font-bold text-slate-900 dark:text-white text-sm">
                {{ job.position }}
              </div>
              <div class="text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 mt-0.5">
                <Building2 class="w-3 h-3 text-slate-400" />
                <span>{{ job.companyName }}</span>
                <span v-if="job.location">&bull; {{ job.location }}</span>
              </div>
            </td>

            <!-- Platform -->
            <td class="py-3.5 px-4">
              <span v-if="job.platform" class="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-100 dark:border-indigo-900/40">
                {{ job.platform.name }}
              </span>
              <span v-else class="text-slate-400">-</span>
            </td>

            <!-- Work Type -->
            <td class="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
              {{ job.workType }}
            </td>

            <!-- Salary -->
            <td class="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
              {{ formatCurrency(job.expectedSalary) }}
            </td>

            <!-- Status Dropdown Quick Update -->
            <td class="py-3.5 px-4" @click.stop>
              <select
                :value="job.status"
                @change="jobStore.updateJobStatus(job.id, ($event.target as HTMLSelectElement).value as ApplicationStatus)"
                class="text-xs font-bold py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="WISHLIST">📌 Wishlist</option>
                <option value="APPLIED">📤 Terkirim</option>
                <option value="TEST">📝 Tes Koding</option>
                <option value="INTERVIEW_HR">🗣️ Wawancara HR</option>
                <option value="INTERVIEW_USER">👥 Wawancara User</option>
                <option value="OFFERING">🎉 Offering</option>
                <option value="ACCEPTED">🚀 Diterima</option>
                <option value="REJECTED">❌ Ditolak</option>
                <option value="WITHDRAWN">⛔ Batal</option>
              </select>
            </td>

            <!-- Date -->
            <td class="py-3.5 px-4 text-slate-500 dark:text-slate-400">
              {{ formatDate(job.appliedDate || job.createdAt) }}
            </td>

            <!-- Actions -->
            <td class="py-3.5 px-4 text-right" @click.stop>
              <div class="flex items-center justify-end space-x-2">
                <a
                  v-if="job.jobUrl"
                  :href="job.jobUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                  title="Buka Link Loker Asli"
                >
                  <ExternalLink class="w-4 h-4" />
                </a>

                <button
                  @click="jobStore.deleteJob(job.id)"
                  class="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                  title="Hapus"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="!jobStore.filteredJobs.length">
            <td colspan="7" class="py-10 text-center text-slate-400 text-xs">
              Belum ada data lowongan kerja yang sesuai dengan filter pencarian.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

