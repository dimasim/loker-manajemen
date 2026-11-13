import { JobPlatform } from '@prisma/client';
import { IPlatformRepository, IPlatformService } from './platform.interface';

export class PlatformService implements IPlatformService {
  private platformRepository: IPlatformRepository;

  constructor(platformRepository: IPlatformRepository) {
    this.platformRepository = platformRepository;
  }

  public async getAllPlatforms(): Promise<JobPlatform[]> {
    return this.platformRepository.findAll();
  }
}

