<script setup lang="ts">
import { ref } from 'vue';
import { useJobStore } from '../stores/job.store';
import { ApplicationStatus, JobApplication } from '../types/job.types';
import JobCard from './JobCard.vue';
import { Plus } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'openCreate'): void;
  (e: 'selectJob', job: JobApplication): void;
}>();

const jobStore = useJobStore();

const columns: Array<{
  id: ApplicationStatus;
  title: string;
  emoji: string;
  color: string;
  badge: string;
}> = [
  { id: 'WISHLIST', title: 'Wishlist', emoji: '📌', color: 'border-slate-300 dark:border-slate-700', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { id: 'APPLIED', title: 'Terkirim', emoji: '📤', color: 'border-indigo-300 dark:border-indigo-800', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
  { id: 'TEST', title: 'Tes Koding', emoji: '📝', color: 'border-cyan-300 dark:border-cyan-800', badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300' },
  { id: 'INTERVIEW_HR', title: 'Wawancara HR', emoji: '🗣️', color: 'border-amber-300 dark:border-amber-800', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  { id: 'INTERVIEW_USER', title: 'Wawancara User', emoji: '👥', color: 'border-orange-300 dark:border-orange-800', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
  { id: 'OFFERING', title: 'Offering', emoji: '🎉', color: 'border-purple-300 dark:border-purple-800', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
  { id: 'ACCEPTED', title: 'Diterima', emoji: '🚀', color: 'border-emerald-300 dark:border-emerald-800', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  { id: 'REJECTED', title: 'Ditolak', emoji: '❌', color: 'border-rose-300 dark:border-rose-800', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
];

// Drag & Drop State
const draggedJobId = ref<string | null>(null);

const onDragStart = (e: DragEvent, jobId: string) => {
  draggedJobId.value = jobId;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', jobId);
  }
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move';
  }
};

const onDrop = async (e: DragEvent, targetStatus: ApplicationStatus) => {
  e.preventDefault();
  const jobId = draggedJobId.value || e.dataTransfer?.getData('text/plain');
  if (jobId) {
    await jobStore.updateJobStatus(jobId, targetStatus);
    draggedJobId.value = null;
  }
};
</script>

<template>
  <div class="overflow-x-auto pb-6">
    <div class="flex space-x-4 min-w-[1500px]">
      <div
        v-for="col in columns"
        :key="col.id"
        class="w-72 flex-shrink-0 flex flex-col bg-slate-100/70 dark:bg-slate-900/40 rounded-3xl p-3.5 border border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200"
        @dragover="onDragOver"
        @drop="onDrop($event, col.id)"
      >
        <!-- Column Header -->
        <div class="flex items-center justify-between px-2 py-2 mb-2">
          <div class="flex items-center space-x-2">
            <span class="text-base">{{ col.emoji }}</span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
              {{ col.title }}
            </span>
          </div>

          <span
            class="text-xs font-bold px-2 py-0.5 rounded-full"
            :class="col.badge"
          >
            {{ jobStore.jobsByStatus[col.id]?.length || 0 }}
          </span>
        </div>

        <!-- Cards List -->
        <div class="flex-1 space-y-3 min-h-[300px]">
          <div
            v-for="job in jobStore.jobsByStatus[col.id]"
            :key="job.id"
            draggable="true"
            @dragstart="onDragStart($event, job.id)"
            class="transform active:scale-95 transition"
          >
            <JobCard
              :job="job"
              @select="emit('selectJob', $event)"
              @moveStatus="jobStore.updateJobStatus"
            />
          </div>

          <!-- Empty Column Indicator -->
          <div
            v-if="!jobStore.jobsByStatus[col.id]?.length"
            class="h-28 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-center justify-center text-xs text-slate-400 dark:text-slate-600 select-none"
          >
            Tarik loker ke sini
          </div>
        </div>

        <!-- Add Button per Column (Special for Wishlist) -->
        <button
          v-if="col.id === 'WISHLIST'"
          @click="emit('openCreate')"
          class="mt-3 w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-xl text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center justify-center space-x-1.5 transition"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Tambah Loker</span>
        </button>
      </div>
    </div>
  </div>
</template>
