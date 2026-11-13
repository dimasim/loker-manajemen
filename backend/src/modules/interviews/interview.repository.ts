import { PrismaClient, Interview } from '@prisma/client';
import { IInterviewRepository } from './interview.interface';
import { CreateInterviewDTO, UpdateInterviewDTO } from './interview.schema';
import { DatabaseClient } from '../../core/database/prisma.client';

export class InterviewRepository implements IInterviewRepository {
  private prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance || DatabaseClient.getInstance();
  }

  public async findByJobId(userId: string, applicationId: string): Promise<Interview[]> {
    return this.prisma.interview.findMany({
      where: {
        applicationId,
        application: { userId },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  public async findById(userId: string, id: string): Promise<Interview | null> {
    return this.prisma.interview.findFirst({
      where: {
        id,
        application: { userId },
      },
    });
  }

  public async create(userId: string, data: CreateInterviewDTO): Promise<Interview> {
    // Validasi kepemilikan lowongan kerja terlebih dahulu
    const job = await this.prisma.jobApplication.findFirst({
      where: { id: data.applicationId, userId },
    });
    if (!job) {
      throw new Error('JOB_NOT_FOUND_OR_FORBIDDEN');
    }

    return this.prisma.interview.create({
      data: {
        applicationId: data.applicationId,
        stage: data.stage,
        scheduledAt: new Date(data.scheduledAt),
        meetingLink: data.meetingLink || null,
        interviewer: data.interviewer || null,
        notes: data.notes || null,
        isDone: false,
      },
    });
  }

  public async update(
    userId: string,
    id: string,
    data: UpdateInterviewDTO
  ): Promise<Interview | null> {
    const existing = await this.findById(userId, id);
    if (!existing) return null;

    return this.prisma.interview.update({
      where: { id },
      data: {
        stage: data.stage,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        meetingLink: data.meetingLink !== undefined ? data.meetingLink || null : undefined,
        interviewer: data.interviewer !== undefined ? data.interviewer || null : undefined,
        notes: data.notes !== undefined ? data.notes || null : undefined,
        isDone: data.isDone !== undefined ? data.isDone : undefined,
      },
    });
  }

  public async delete(userId: string, id: string): Promise<boolean> {
    const existing = await this.findById(userId, id);
    if (!existing) return false;

    await this.prisma.interview.delete({
      where: { id },
    });

    return true;
  }
}

