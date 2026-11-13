import { JobPlatform } from '@prisma/client';

export interface IPlatformRepository {
  findAll(): Promise<JobPlatform[]>;
  findById(id: number): Promise<JobPlatform | null>;
}

export interface IPlatformService {
  getAllPlatforms(): Promise<JobPlatform[]>;
}

