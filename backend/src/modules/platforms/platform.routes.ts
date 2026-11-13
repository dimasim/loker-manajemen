import { Router } from 'express';
import { PlatformRepository } from './platform.repository';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';
import { AuthMiddleware } from '../../core/middlewares/auth.middleware';

export class PlatformRoutes {
  public router: Router;
  private platformController: PlatformController;

  constructor() {
    this.router = Router();

    const platformRepository = new PlatformRepository();
    const platformService = new PlatformService(platformRepository);
    this.platformController = new PlatformController(platformService);

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Bisa diakses oleh user yang terautentikasi untuk pilihan dropdown form
    this.router.get('/', AuthMiddleware.authenticate, this.platformController.getAll);
  }
}

export const platformRouter = new PlatformRoutes().router;
export default platformRouter;

