import apiClient from '../../../core/api/api.client';
import { ApiResponse, AuthResponseData, User } from '../../../core/types/auth.types';

export class AuthApiService {
  public static async login(credentials: { email: string; password: string }): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', credentials);
    if (!response.data.data) {
      throw new Error(response.data.message || 'Login gagal');
    }
    return response.data.data;
  }

  public static async register(data: { fullName: string; email: string; password: string }): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    if (!response.data.data) {
      throw new Error(response.data.message || 'Registrasi gagal');
    }
    return response.data.data;
  }

  public static async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    if (!response.data.data?.user) {
      throw new Error('Gagal mengambil data profil');
    }
    return response.data.data.user;
  }
}

