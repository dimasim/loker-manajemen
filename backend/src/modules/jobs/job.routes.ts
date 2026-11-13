import { Router } from 'express';
import { JobRepository } from './job.repository';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { AuthMiddleware } from '../../core/middlewares/auth.middleware';
import { ValidationMiddleware } from '../../core/middlewares/validate.middleware';
import { createJobSchema, updateJobSchema, updateJobStatusSchema } from './job.schema';

export class JobRoutes {
  public router: Router;
  private jobController: JobController;

  constructor() {
    this.router = Router();

    // Dependency Injection
    const jobRepository = new JobRepository();
    const jobService = new JobService(jobRepository);
    this.jobController = new JobController(jobService);

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Semua endpoint loker dilindungi oleh AuthMiddleware (hanya pemilik akun yang dapat mengakses)
    this.router.use(AuthMiddleware.authenticate);

    this.router.get('/', this.jobController.getAll);
    this.router.get('/stats', this.jobController.getStats);
    this.router.get('/:id', this.jobController.getById);

    this.router.post(
      '/',
      ValidationMiddleware.validate(createJobSchema),
      this.jobController.create
    );

    this.router.put(
      '/:id',
      ValidationMiddleware.validate(updateJobSchema),
      this.jobController.update
    );

    this.router.patch(
      '/:id/status',
      ValidationMiddleware.validate(updateJobStatusSchema),
      this.jobController.updateStatus
    );

    this.router.delete('/:id', this.jobController.delete);
  }
}

export const jobRouter = new JobRoutes().router;
export default jobRouter;

