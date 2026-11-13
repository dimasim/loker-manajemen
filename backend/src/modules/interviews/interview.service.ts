import { Interview } from '@prisma/client';
import { IInterviewService, IInterviewRepository } from './interview.interface';
import { CreateInterviewDTO, UpdateInterviewDTO } from './interview.schema';
import { NotFoundError } from '../../core/errors/app.error';

export class InterviewService implements IInterviewService {
  private interviewRepository: IInterviewRepository;

  constructor(interviewRepository: IInterviewRepository) {
    this.interviewRepository = interviewRepository;
  }

  public async getInterviewsByJobId(userId: string, applicationId: string): Promise<Interview[]> {
    return this.interviewRepository.findByJobId(userId, applicationId);
  }

  public async createInterview(userId: string, dto: CreateInterviewDTO): Promise<Interview> {
    try {
      return await this.interviewRepository.create(userId, dto);
    } catch (error: any) {
      if (error.message === 'JOB_NOT_FOUND_OR_FORBIDDEN') {
        throw new NotFoundError('Lowongan kerja tidak ditemukan atau bukan milik akun Anda.');
      }
      throw error;
    }
  }

  public async updateInterview(
    userId: string,
    id: string,
    dto: UpdateInterviewDTO
  ): Promise<Interview> {
    const updated = await this.interviewRepository.update(userId, id, dto);
    if (!updated) {
      throw new NotFoundError('Jadwal interview tidak ditemukan atau bukan milik akun Anda.');
    }
    return updated;
  }

  public async deleteInterview(userId: string, id: string): Promise<void> {
    const deleted = await this.interviewRepository.delete(userId, id);
    if (!deleted) {
      throw new NotFoundError('Jadwal interview tidak ditemukan atau bukan milik akun Anda.');
    }
  }
}

