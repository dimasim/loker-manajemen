import { Interview } from '@prisma/client';
import { CreateInterviewDTO, UpdateInterviewDTO } from './interview.schema';

export interface IInterviewRepository {
  findByJobId(userId: string, applicationId: string): Promise<Interview[]>;
  findById(userId: string, id: string): Promise<Interview | null>;
  create(userId: string, data: CreateInterviewDTO): Promise<Interview>;
  update(userId: string, id: string, data: UpdateInterviewDTO): Promise<Interview | null>;
  delete(userId: string, id: string): Promise<boolean>;
}

export interface IInterviewService {
  getInterviewsByJobId(userId: string, applicationId: string): Promise<Interview[]>;
  createInterview(userId: string, dto: CreateInterviewDTO): Promise<Interview>;
  updateInterview(userId: string, id: string, dto: UpdateInterviewDTO): Promise<Interview>;
  deleteInterview(userId: string, id: string): Promise<void>;
}

