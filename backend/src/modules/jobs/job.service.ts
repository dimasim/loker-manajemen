import { JobApplication, ApplicationStatus } from '@prisma/client';
import { IJobService, IJobRepository, JobWithRelations } from './job.interface';
import { CreateJobDTO, UpdateJobDTO, JobQueryDTO } from './job.schema';
import { NotFoundError } from '../../core/errors/app.error';

export class JobService implements IJobService {
  private jobRepository: IJobRepository;

  constructor(jobRepository: IJobRepository) {
    this.jobRepository = jobRepository;
  }

  public async getJobs(userId: string, query?: JobQueryDTO): Promise<JobWithRelations[]> {
    return this.jobRepository.findAll(userId, query);
  }

  public async getJobById(userId: string, id: string): Promise<JobWithRelations> {
    const job = await this.jobRepository.findById(userId, id);
    if (!job) {
      throw new NotFoundError('Lowongan kerja tidak ditemukan atau bukan milik akun Anda.');
    }
    return job;
  }

  public async createJob(userId: string, dto: CreateJobDTO): Promise<JobApplication> {
    return this.jobRepository.create(userId, dto);
  }

  public async updateJob(userId: string, id: string, dto: UpdateJobDTO): Promise<JobApplication> {
    const updated = await this.jobRepository.update(userId, id, dto);
    if (!updated) {
      throw new NotFoundError('Lowongan kerja tidak ditemukan atau bukan milik akun Anda.');
    }
    return updated;
  }

  public async updateJobStatus(
    userId: string,
    id: string,
    status: ApplicationStatus
  ): Promise<JobApplication> {
    const updated = await this.jobRepository.updateStatus(userId, id, status);
    if (!updated) {
      throw new NotFoundError('Lowongan kerja tidak ditemukan atau bukan milik akun Anda.');
    }
    return updated;
  }

  public async deleteJob(userId: string, id: string): Promise<void> {
    const deleted = await this.jobRepository.delete(userId, id);
    if (!deleted) {
      throw new NotFoundError('Lowongan kerja tidak ditemukan atau bukan milik akun Anda.');
    }
  }

  public async getJobStats(userId: string): Promise<Record<string, number>> {
    return this.jobRepository.countByStatus(userId);
  }
}

