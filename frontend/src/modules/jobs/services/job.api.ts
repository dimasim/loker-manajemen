import apiClient from '../../../core/api/api.client';
import {
  JobApplication,
  Platform,
  CreateJobPayload,
  CreateInterviewPayload,
  Interview,
  ApplicationStatus,
} from '../types/job.types';

export class JobApiService {
  public static async getJobs(params?: {
    status?: string;
    workType?: string;
    platformId?: number;
    search?: string;
  }): Promise<JobApplication[]> {
    const res = await apiClient.get('/jobs', { params });
    return res.data?.data?.jobs || [];
  }

  public static async getJobById(id: string): Promise<JobApplication> {
    const res = await apiClient.get(`/jobs/${id}`);
    return res.data?.data?.job;
  }

  public static async createJob(payload: CreateJobPayload): Promise<JobApplication> {
    const res = await apiClient.post('/jobs', payload);
    return res.data?.data?.job;
  }

  public static async updateJob(id: string, payload: Partial<CreateJobPayload>): Promise<JobApplication> {
    const res = await apiClient.put(`/jobs/${id}`, payload);
    return res.data?.data?.job;
  }

  public static async updateJobStatus(id: string, status: ApplicationStatus): Promise<JobApplication> {
    const res = await apiClient.patch(`/jobs/${id}/status`, { status });
    return res.data?.data?.job;
  }

  public static async deleteJob(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  }

  public static async getStats(): Promise<Record<string, number>> {
    const res = await apiClient.get('/jobs/stats');
    return res.data?.data?.stats || {};
  }

  public static async getPlatforms(): Promise<Platform[]> {
    const res = await apiClient.get('/platforms');
    return res.data?.data?.platforms || [];
  }

  public static async createInterview(payload: CreateInterviewPayload): Promise<Interview> {
    const res = await apiClient.post('/interviews', payload);
    return res.data?.data?.interview;
  }

  public static async deleteInterview(id: string): Promise<void> {
    await apiClient.delete(`/interviews/${id}`);
  }
}
