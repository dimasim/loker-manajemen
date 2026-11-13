export type RoleType = 'ADMIN' | 'USER';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: RoleType;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error' | 'fail';
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

