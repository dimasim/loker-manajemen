import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { User } from '../../../core/types/auth.types';
import { AuthApiService } from '../services/auth.api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('loker_auth_token'));
  const user = ref<User | null>(
    localStorage.getItem('loker_auth_user')
      ? JSON.parse(localStorage.getItem('loker_auth_user')!)
      : null
  );
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const userFullName = computed(() => user.value?.fullName || 'Pelamar');
  const userRole = computed(() => user.value?.role || 'USER');

  /**
   * Set authentication state
   */
  const setAuth = (authToken: string, authUser: User) => {
    token.value = authToken;
    user.value = authUser;
    localStorage.setItem('loker_auth_token', authToken);
    localStorage.setItem('loker_auth_user', JSON.stringify(authUser));
  };

  /**
   * Clear authentication state (Logout)
   */
  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('loker_auth_token');
    localStorage.removeItem('loker_auth_user');
  };

  /**
   * Action: Login
   */
  const login = async (credentials: { email: string; password: string }) => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await AuthApiService.login(credentials);
      setAuth(data.token, data.user);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal login';
      error.value = msg;
      throw new Error(msg);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Action: Register
   */
  const register = async (data: { fullName: string; email: string; password: string }) => {
    isLoading.value = true;
    error.value = null;
    try {
      const result = await AuthApiService.register(data);
      setAuth(result.token, result.user);
      return result;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal registrasi';
      error.value = msg;
      throw new Error(msg);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Action: Validasi sesi dan refresh data profil
   */
  const checkAuth = async () => {
    if (!token.value) return false;
    try {
      const profile = await AuthApiService.getProfile();
      user.value = profile;
      localStorage.setItem('loker_auth_user', JSON.stringify(profile));
      return true;
    } catch (err) {
      logout();
      return false;
    }
  };

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    userFullName,
    userRole,
    login,
    register,
    logout,
    checkAuth,
  };
});

