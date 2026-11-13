import { Request, Response, NextFunction } from 'express';
import { IPlatformService } from './platform.interface';

export class PlatformController {
  private platformService: IPlatformService;

  constructor(platformService: IPlatformService) {
    this.platformService = platformService;
  }

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const platforms = await this.platformService.getAllPlatforms();
      res.status(200).json({
        status: 'success',
        message: 'Daftar platform berhasil diambil',
        data: { platforms },
      });
    } catch (error) {
      next(error);
    }
  };
}

