import { JobApplication, ApplicationStatus } from '@prisma/client';
import { CreateJobDTO, UpdateJobDTO, JobQueryDTO } from './job.schema';

export type JobWithRelations = JobApplication & {
  platform: { id: number; name: string; url: string | null } | null;
  interviews?: Array<{
    id: string;
    stage: string;
    scheduledAt: Date;
    meetingLink: string | null;
    interviewer: string | null;
    notes: string | null;
    isDone: boolean;
  }>;
};

export interface IJobRepository {
  findAll(userId: string, query?: JobQueryDTO): Promise<JobWithRelations[]>;
  findById(userId: string, id: string): Promise<JobWithRelations | null>;
  create(userId: string, data: CreateJobDTO): Promise<JobApplication>;
  update(userId: string, id: string, data: UpdateJobDTO): Promise<JobApplication | null>;
  updateStatus(userId: string, id: string, status: ApplicationStatus): Promise<JobApplication | null>;
  delete(userId: string, id: string): Promise<boolean>;
  countByStatus(userId: string): Promise<Record<string, number>>;
}

export interface IJobService {
  getJobs(userId: string, query?: JobQueryDTO): Promise<JobWithRelations[]>;
  getJobById(userId: string, id: string): Promise<JobWithRelations>;
  createJob(userId: string, dto: CreateJobDTO): Promise<JobApplication>;
  updateJob(userId: string, id: string, dto: UpdateJobDTO): Promise<JobApplication>;
  updateJobStatus(userId: string, id: string, status: ApplicationStatus): Promise<JobApplication>;
  deleteJob(userId: string, id: string): Promise<void>;
  getJobStats(userId: string): Promise<Record<string, number>>;
}

