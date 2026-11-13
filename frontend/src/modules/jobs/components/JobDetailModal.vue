<script setup lang="ts">
import { ref } from 'vue';
import { useJobStore } from '../stores/job.store';
import { ApplicationStatus, InterviewStage } from '../types/job.types';
import {
  X,
  ExternalLink,
  Building2,
  Calendar,
  Video,
  User,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
} from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const jobStore = useJobStore();
const job = jobStore.selectedJob;

// Form interview
const showAddInterview = ref<boolean>(false);
const interviewStage = ref<InterviewStage>('HR_INTERVIEW');
const scheduledAt = ref<string>('');
const meetingLink = ref<string>('');
const interviewer = ref<string>('');
const interviewNotes = ref<string>('');
const isSubmittingInterview = ref<boolean>(false);

const handleStatusChange = async (e: Event) => {
  if (!job) return;
  const target = e.target as HTMLSelectElement;
  await jobStore.updateJobStatus(job.id, target.value as ApplicationStatus);
};

const handleAddInterview = async () => {
  if (!job || !scheduledAt.value) return;

  isSubmittingInterview.value = true;
  try {
    await jobStore.addInterview({
      applicationId: job.id,
      stage: interviewStage.value,
      scheduledAt: new Date(scheduledAt.value).toISOString(),
      meetingLink: meetingLink.value || undefined,
      interviewer: interviewer.value || undefined,
      notes: interviewNotes.value || undefined,
    });
    showAddInterview.value = false;
    scheduledAt.value = '';
    meetingLink.value = '';
    interviewer.value = '';
    interviewNotes.value = '';
  } catch (err: any) {
    alert(err.message || 'Gagal menambah interview');
  } finally {
    isSubmittingInterview.value = false;
  }
};

const handleDeleteJob = async () => {
  if (!job) return;
  if (confirm(`Yakin ingin menghapus catatan loker "${job.position}" di "${job.companyName}"?`)) {
    await jobStore.deleteJob(job.id);
    emit('close');
  }
};

const formatDateTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<template>
  <div v-if="job" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-colors duration-200">
      <!-- Modal Header -->
      <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between">
        <div class="min-w-0 pr-4">
          <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <Building2 class="w-4 h-4 text-indigo-500" />
            <span>{{ job.companyName }}</span>
            <span v-if="job.location">&bull; {{ job.location }}</span>
          </div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {{ job.position }}
          </h2>
        </div>

        <button
          @click="emit('close')"
          class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        <!-- Direct External Link Banner -->
        <div
          v-if="job.jobUrl"
          class="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-between gap-4"
        >
          <div class="min-w-0">
            <div class="text-xs font-semibold text-indigo-900 dark:text-indigo-300">Tautan Postingan Loker Asli</div>
            <div class="text-xs text-indigo-700 dark:text-indigo-400 truncate font-mono mt-0.5">
              {{ job.jobUrl }}
            </div>
          </div>
          <a
            :href="job.jobUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow transition flex-shrink-0"
          >
            <span>Buka Link Loker</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
        </div>

        <!-- Status & Meta Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div>
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Status Lamaran</div>
            <select
              :value="job.status"
              @change="handleStatusChange"
              class="w-full text-xs font-bold py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="WISHLIST">📌 Wishlist</option>
              <option value="APPLIED">📤 Terkirim (Applied)</option>
              <option value="TEST">📝 Tes Koding / Psikotes</option>
              <option value="INTERVIEW_HR">🗣️ Interview HR</option>
              <option value="INTERVIEW_USER">👥 Interview User</option>
              <option value="OFFERING">🎉 Offering Letter</option>
              <option value="ACCEPTED">🚀 Diterima (Accepted)</option>
              <option value="REJECTED">❌ Ditolak (Rejected)</option>
              <option value="WITHDRAWN">⛔ Batal (Withdrawn)</option>
            </select>
          </div>

          <div>
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Tipe Kerja</div>
            <div class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
              {{ job.workType }}
            </div>
          </div>

          <div>
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Platform Asal</div>
            <div class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
              {{ job.platform?.name || 'Manual Input' }}
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div v-if="job.notes">
          <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Catatan Pribadi</h4>
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {{ job.notes }}
          </div>
        </div>

        <!-- Interview Section -->
        <div class="border-t border-slate-200 dark:border-slate-800 pt-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h4 class="text-sm font-bold text-slate-900 dark:text-white">Jadwal Interview & Tes</h4>
              <p class="text-xs text-slate-500">Catat link Google Meet, Zoom, dan catatan interview</p>
            </div>
            <button
              v-if="!showAddInterview"
              @click="showAddInterview = true"
              class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Jadwal Baru</span>
            </button>
          </div>

          <!-- Add Interview Form -->
          <div v-if="showAddInterview" class="mb-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
            <div class="text-xs font-bold text-indigo-900 dark:text-indigo-300">Tambah Jadwal Baru</div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Tahap</label>
                <select
                  v-model="interviewStage"
                  class="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 dark:text-white"
                >
                  <option value="HR_INTERVIEW">Wawancara HR</option>
                  <option value="TECH_TEST">Tes Teknis / Koding</option>
                  <option value="USER_INTERVIEW">Wawancara User / Lead</option>
                  <option value="FINAL_INTERVIEW">Final / BOD Interview</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Waktu & Tanggal</label>
                <input
                  v-model="scheduledAt"
                  type="datetime-local"
                  required
                  class="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Link Panggilan Video</label>
                <input
                  v-model="meetingLink"
                  type="url"
                  placeholder="https://meet.google.com/..."
                  class="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Interviewer</label>
                <input
                  v-model="interviewer"
                  type="text"
                  placeholder="Contoh: Sarah (HR), Budi (Tech Lead)"
                  class="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Catatan Kisi-kisi / Hasil</label>
              <textarea
                v-model="interviewNotes"
                rows="2"
                placeholder="Catatan pertanyaan yang ditanyakan, feedback, dll..."
                class="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 dark:text-white"
              ></textarea>
            </div>

            <div class="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                @click="showAddInterview = false"
                class="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Batal
              </button>
              <button
                type="button"
                @click="handleAddInterview"
                :disabled="isSubmittingInterview"
                class="px-4 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow"
              >
                {{ isSubmittingInterview ? 'Menyimpan...' : 'Simpan Jadwal' }}
              </button>
            </div>
          </div>

          <!-- Existing Interviews List -->
          <div v-if="job.interviews && job.interviews.length > 0" class="space-y-3">
            <div
              v-for="iv in job.interviews"
              :key="iv.id"
              class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span class="text-xs font-bold text-slate-800 dark:text-white">
                    {{ iv.stage }}
                  </span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center">
                    <Clock class="w-3 h-3 mr-1" />
                    {{ formatDateTime(iv.scheduledAt) }}
                  </span>
                </div>
                <div v-if="iv.interviewer" class="text-xs text-slate-500 flex items-center">
                  <User class="w-3 h-3 mr-1 text-slate-400" />
                  Interviewer: {{ iv.interviewer }}
                </div>
                <div v-if="iv.notes" class="text-xs text-slate-600 dark:text-slate-400 italic">
                  "{{ iv.notes }}"
                </div>
              </div>

              <div class="flex items-center space-x-2 flex-shrink-0">
                <a
                  v-if="iv.meetingLink"
                  :href="iv.meetingLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow transition"
                >
                  <Video class="w-3.5 h-3.5" />
                  <span>Buka Video Call</span>
                </a>
              </div>
            </div>
          </div>

          <div v-else-if="!showAddInterview" class="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            Belum ada jadwal wawancara untuk lowongan ini.
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          type="button"
          @click="handleDeleteJob"
          class="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
        >
          <Trash2 class="w-4 h-4" />
          <span>Hapus Loker Ini</span>
        </button>

        <button
          type="button"
          @click="emit('close')"
          class="px-5 py-2 text-xs font-bold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>
