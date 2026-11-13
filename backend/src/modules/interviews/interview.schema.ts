import { z } from 'zod';
import { InterviewStage } from '@prisma/client';

export const createInterviewSchema = z.object({
  applicationId: z.string().uuid('ID lowongan tidak valid'),
  stage: z.nativeEnum(InterviewStage).default(InterviewStage.HR_INTERVIEW),
  scheduledAt: z.string({ required_error: 'Jadwal waktu wawancara wajib diisi' }).datetime(),
  meetingLink: z.string().url('Format link meeting tidak valid').optional().or(z.literal('')),
  interviewer: z.string().max(150).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateInterviewSchema = z.object({
  stage: z.nativeEnum(InterviewStage).optional(),
  scheduledAt: z.string().datetime().optional(),
  meetingLink: z.string().url('Format link meeting tidak valid').optional().or(z.literal('')),
  interviewer: z.string().max(150).optional().nullable(),
  notes: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
});

export type CreateInterviewDTO = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewDTO = z.infer<typeof updateInterviewSchema>;

