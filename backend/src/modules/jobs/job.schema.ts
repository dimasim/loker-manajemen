import { z } from 'zod';
import { ApplicationStatus, WorkType } from '@prisma/client';

export const createJobSchema = z.object({
  companyName: z
    .string({ required_error: 'Nama perusahaan wajib diisi' })
    .min(1, 'Nama perusahaan tidak boleh kosong')
    .max(150, 'Nama perusahaan maksimal 150 karakter'),
  position: z
    .string({ required_error: 'Posisi/jabatan yang dilamar wajib diisi' })
    .min(1, 'Posisi tidak boleh kosong')
    .max(150, 'Posisi maksimal 150 karakter'),
  jobUrl: z
    .string()
    .url('Format tautan (URL) lowongan tidak valid')
    .optional()
    .or(z.literal('')),
  platformId: z.number().int().positive().optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  workType: z.nativeEnum(WorkType).default(WorkType.REMOTE),
  expectedSalary: z.number().positive('Gaji harus berupa angka positif').optional().nullable(),
  status: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.WISHLIST),
  appliedDate: z.string().datetime().optional().nullable(),
  deadline: z.string().datetime().optional().nullable(),
  resumeUsed: z.string().max(150).optional().nullable(),
  hrContact: z.string().max(150).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateJobSchema = createJobSchema.partial();

export const updateJobStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus, {
    required_error: 'Status baru wajib diisi',
  }),
});

export const jobQuerySchema = z.object({
  status: z.nativeEnum(ApplicationStatus).optional(),
  platformId: z.string().regex(/^\d+$/).transform(Number).optional(),
  workType: z.nativeEnum(WorkType).optional(),
  search: z.string().optional(),
});

export type CreateJobDTO = z.infer<typeof createJobSchema>;
export type UpdateJobDTO = z.infer<typeof updateJobSchema>;
export type UpdateJobStatusDTO = z.infer<typeof updateJobStatusSchema>;
export type JobQueryDTO = z.infer<typeof jobQuerySchema>;

