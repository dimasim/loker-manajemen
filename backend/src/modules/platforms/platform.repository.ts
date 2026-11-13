import { PrismaClient, JobPlatform } from '@prisma/client';
import { IPlatformRepository } from './platform.interface';
import { DatabaseClient } from '../../core/database/prisma.client';

export class PlatformRepository implements IPlatformRepository {
  private prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance || DatabaseClient.getInstance();
  }

  public async findAll(): Promise<JobPlatform[]> {
    return this.prisma.jobPlatform.findMany({
      orderBy: { id: 'asc' },
    });
  }

  public async findById(id: number): Promise<JobPlatform | null> {
    return this.prisma.jobPlatform.findUnique({
      where: { id },
    });
  }
}

