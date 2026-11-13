<script setup lang="ts">
import { ref } from 'vue';
import { useJobStore } from '../stores/job.store';
import { ApplicationStatus, WorkType, CreateJobPayload } from '../types/job.types';
import { X, Plus, Link, Building2, Briefcase, MapPin, DollarSign, FileText } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'created'): void;
}>();

const jobStore = useJobStore();

const form = ref<CreateJobPayload>({
  companyName: '',
  position: '',
  jobUrl: '',
  platformId: null,
  location: '',
  workType: 'REMOTE' as WorkType,
  expectedSalary: null,
  status: 'WISHLIST' as ApplicationStatus,
  notes: '',
});

const isSubmitting = ref<boolean>(false);
const errorMessage = ref<string>('');

const handleSubmit = async () => {
  if (!form.value.companyName || !form.value.position) {
    errorMessage.value = 'Nama perusahaan dan posisi jabatan wajib diisi';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    await jobStore.createJob({
      ...form.value,
      expectedSalary: form.value.expectedSalary ? Number(form.value.expectedSalary) : null,
      platformId: form.value.platformId ? Number(form.value.platformId) : null,
    });
    emit('created');
    emit('close');
  } catch (err: any) {
    errorMessage.value = err.message || 'Gagal menyimpan lowongan kerja';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-colors duration-200">
      <!-- Modal Header -->
      <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Tambah Catatan Loker Baru</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">Catat lowongan yang ingin Anda daftari atau sudah dikirim</p>
        </div>
        <button
          @click="emit('close')"
          class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Error Notification -->
      <div v-if="errorMessage" class="mx-6 mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 rounded-xl text-xs">
        {{ errorMessage }}
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Job URL Link -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Link / Tautan Lowongan Kerja
          </label>
          <div class="relative rounded-xl shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Link class="w-4 h-4" />
            </div>
            <input
              v-model="form.jobUrl"
              type="url"
              placeholder="https://linkedin.com/jobs/view/... atau link postingan"
              class="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <p class="mt-1 text-[11px] text-slate-400">Tempelkan link lowongan asli agar mudah dibuka kembali kapan saja.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Company Name -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Nama Perusahaan <span class="text-rose-500">*</span>
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 class="w-4 h-4" />
              </div>
              <input
                v-model="form.companyName"
                type="text"
                required
                placeholder="Contoh: PT GoTo, Shopee, Startup XYZ"
                class="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <!-- Position Title -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Posisi / Jabatan <span class="text-rose-500">*</span>
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Briefcase class="w-4 h-4" />
              </div>
              <input
                v-model="form.position"
                type="text"
                required
                placeholder="Contoh: Frontend Developer"
                class="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Platform Sourced -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Platform Asal
            </label>
            <select
              v-model="form.platformId"
              class="block w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option :value="null">Pilih Platform...</option>
              <option v-for="plat in jobStore.platforms" :key="plat.id" :value="plat.id">
                {{ plat.name }}
              </option>
            </select>
          </div>

          <!-- Work Type -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Tipe Kerja
            </label>
            <select
              v-model="form.workType"
              class="block w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ON_SITE">On-Site (WFO)</option>
            </select>
          </div>

          <!-- Initial Status -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Status Awal
            </label>
            <select
              v-model="form.status"
              class="block w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="WISHLIST">📌 Wishlist (Belum Kirim)</option>
              <option value="APPLIED">📤 Terkirim (Applied)</option>
              <option value="TEST">📝 Tes Koding / Psikotes</option>
              <option value="INTERVIEW_HR">🗣️ Interview HR</option>
              <option value="INTERVIEW_USER">👥 Interview User</option>
              <option value="OFFERING">🎉 Offering Letter</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Expected Salary -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Gaji Ditawarkan / Ekspektasi (IDR)
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <DollarSign class="w-4 h-4" />
              </div>
              <input
                v-model="form.expectedSalary"
                type="number"
                step="500000"
                placeholder="Contoh: 12000000"
                class="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <!-- Location -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Lokasi Kantor
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin class="w-4 h-4" />
              </div>
              <input
                v-model="form.location"
                type="text"
                placeholder="Contoh: Jakarta Selatan / BSD"
                class="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Catatan Pribadi / Kisi-kisi
          </label>
          <div class="relative rounded-xl shadow-sm">
            <div class="absolute top-3 left-3.5 pointer-events-none text-slate-400">
              <FileText class="w-4 h-4" />
            </div>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Catatan requirement penting, tech stack yang diminta, atau nama kenalan di kantor..."
              class="block w-full pl-10 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            ></textarea>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center space-x-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition disabled:opacity-50"
          >
            <Plus class="w-4 h-4" />
            <span>{{ isSubmitting ? 'Menyimpan...' : 'Simpan Loker' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

