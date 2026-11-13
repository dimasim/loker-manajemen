import { PrismaClient, JobApplication, ApplicationStatus, Prisma } from '@prisma/client';
import { IJobRepository, JobWithRelations } from './job.interface';
import { CreateJobDTO, UpdateJobDTO, JobQueryDTO } from './job.schema';
import { DatabaseClient } from '../../core/database/prisma.client';

export class JobRepository implements IJobRepository {
  private prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance || DatabaseClient.getInstance();
  }

  public async findAll(userId: string, query?: JobQueryDTO): Promise<JobWithRelations[]> {
    const where: Prisma.JobApplicationWhereInput = {
      userId,
    };

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.platformId) {
      where.platformId = query.platformId;
    }

    if (query?.workType) {
      where.workType = query.workType;
    }

    if (query?.search) {
      where.OR = [
        { companyName: { contains: query.search, mode: 'insensitive' } },
        { position: { contains: query.search, mode: 'insensitive' } },
        { location: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.jobApplication.findMany({
      where,
      include: {
        platform: {
          select: { id: true, name: true, url: true },
        },
        interviews: {
          orderBy: { scheduledAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  public async findById(userId: string, id: string): Promise<JobWithRelations | null> {
    return this.prisma.jobApplication.findFirst({
      where: { id, userId },
      include: {
        platform: {
          select: { id: true, name: true, url: true },
        },
        interviews: {
          orderBy: { scheduledAt: 'asc' },
        },
      },
    });
  }

  public async create(userId: string, data: CreateJobDTO): Promise<JobApplication> {
    return this.prisma.jobApplication.create({
      data: {
        userId,
        companyName: data.companyName.trim(),
        position: data.position.trim(),
        jobUrl: data.jobUrl || null,
        platformId: data.platformId || null,
        location: data.location || null,
        workType: data.workType,
        expectedSalary: data.expectedSalary ? new Prisma.Decimal(data.expectedSalary) : null,
        status: data.status,
        appliedDate: data.appliedDate ? new Date(data.appliedDate) : null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        resumeUsed: data.resumeUsed || null,
        hrContact: data.hrContact || null,
        notes: data.notes || null,
      },
      include: {
        platform: true,
      },
    });
  }

  public async update(
    userId: string,
    id: string,
    data: UpdateJobDTO
  ): Promise<JobApplication | null> {
    // Pastikan milik akun ini dulu
    const exists = await this.prisma.jobApplication.findFirst({
      where: { id, userId },
    });
    if (!exists) return null;

    const updateData: Prisma.JobApplicationUpdateInput = {};

    if (data.companyName !== undefined) updateData.companyName = data.companyName.trim();
    if (data.position !== undefined) updateData.position = data.position.trim();
    if (data.jobUrl !== undefined) updateData.jobUrl = data.jobUrl || null;
    if (data.platformId !== undefined) {
      updateData.platform = data.platformId ? { connect: { id: data.platformId } } : { disconnect: true };
    }
    if (data.location !== undefined) updateData.location = data.location || null;
    if (data.workType !== undefined) updateData.workType = data.workType;
    if (data.expectedSalary !== undefined) {
      updateData.expectedSalary = data.expectedSalary ? new Prisma.Decimal(data.expectedSalary) : null;
    }
    if (data.status !== undefined) updateData.status = data.status;
    if (data.appliedDate !== undefined) {
      updateData.appliedDate = data.appliedDate ? new Date(data.appliedDate) : null;
    }
    if (data.deadline !== undefined) {
      updateData.deadline = data.deadline ? new Date(data.deadline) : null;
    }
    if (data.resumeUsed !== undefined) updateData.resumeUsed = data.resumeUsed || null;
    if (data.hrContact !== undefined) updateData.hrContact = data.hrContact || null;
    if (data.notes !== undefined) updateData.notes = data.notes || null;

    return this.prisma.jobApplication.update({
      where: { id },
      data: updateData,
      include: {
        platform: true,
      },
    });
  }

  public async updateStatus(
    userId: string,
    id: string,
    status: ApplicationStatus
  ): Promise<JobApplication | null> {
    const exists = await this.prisma.jobApplication.findFirst({
      where: { id, userId },
    });
    if (!exists) return null;

    // Jika diubah menjadi APPLIED dan appliedDate belum diisi, otomatis isi tanggal sekarang
    const updateData: Prisma.JobApplicationUpdateInput = { status };
    if (status === ApplicationStatus.APPLIED && !exists.appliedDate) {
      updateData.appliedDate = new Date();
    }

    return this.prisma.jobApplication.update({
      where: { id },
      data: updateData,
      include: {
        platform: true,
      },
    });
  }

  public async delete(userId: string, id: string): Promise<boolean> {
    const exists = await this.prisma.jobApplication.findFirst({
      where: { id, userId },
    });
    if (!exists) return false;

    await this.prisma.jobApplication.delete({
      where: { id },
    });

    return true;
  }

  public async countByStatus(userId: string): Promise<Record<string, number>> {
    const counts = await this.prisma.jobApplication.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true },
    });

    const result: Record<string, number> = {};
    for (const item of counts) {
      result[item.status] = item._count.status;
    }

    return result;
  }
}

