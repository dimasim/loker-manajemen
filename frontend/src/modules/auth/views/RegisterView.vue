<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import ThemeToggle from '../../../core/components/ThemeToggle.vue';
import { Briefcase, Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const fullName = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const errorMessage = ref<string>('');

const handleRegister = async () => {
  if (!fullName.value || !email.value || !password.value) {
    errorMessage.value = 'Semua kolom wajib diisi';
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password minimal 6 karakter';
    return;
  }

  errorMessage.value = '';
  try {
    await authStore.register({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    });
    router.push('/dashboard');
  } catch (err: any) {
    errorMessage.value = err.message || 'Registrasi gagal. Coba lagi.';
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
    <!-- Top-Right Theme Toggle -->
    <div class="absolute top-6 right-6">
      <ThemeToggle />
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 items-center justify-center text-white shadow-lg mb-4">
        <Briefcase class="w-7 h-7" />
      </div>
      <h2 class="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Daftar Akun Pelamar</h2>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Mulai pantau riwayat lowongan kerja Anda secara rapi & privat
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div class="bg-white dark:bg-slate-900 py-8 px-6 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl sm:px-10 transition-colors duration-200">
        <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center">Buat Akun Baru</h3>

        <!-- Error Alert -->
        <div
          v-if="errorMessage"
          class="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2"
        >
          <AlertCircle class="w-4 h-4 flex-shrink-0" />
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Nama Lengkap
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User class="w-4 h-4" />
              </div>
              <input
                v-model="fullName"
                type="text"
                required
                placeholder="Contoh: Dimas Setiawan"
                class="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Email
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail class="w-4 h-4" />
              </div>
              <input
                v-model="email"
                type="email"
                required
                placeholder="nama@email.com"
                class="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Password (Min. 6 Karakter)
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock class="w-4 h-4" />
              </div>
              <input
                v-model="password"
                type="password"
                required
                minlength="6"
                placeholder="••••••••"
                class="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full mt-2 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition disabled:opacity-50"
          >
            <span v-if="!authStore.isLoading">Daftar Sekarang</span>
            <span v-else class="flex items-center space-x-2">
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Mendaftarkan...</span>
            </span>
            <ArrowRight v-if="!authStore.isLoading" class="w-4 h-4 ml-1.5" />
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Sudah punya akun?
          <RouterLink
            to="/login"
            class="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline ml-1"
          >
            Masuk di sini
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
