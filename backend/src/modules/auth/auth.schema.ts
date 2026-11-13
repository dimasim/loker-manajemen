import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z
    .string({ required_error: 'Nama lengkap wajib diisi' })
    .min(3, 'Nama lengkap minimal 3 karakter')
    .max(150, 'Nama lengkap maksimal 150 karakter'),
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Format email tidak valid'),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email wajib diisi' })
    .email('Format email tidak valid'),
  password: z
    .string({ required_error: 'Password wajib diisi' })
    .min(1, 'Password wajib diisi'),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;

