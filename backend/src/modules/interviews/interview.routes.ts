import { Router } from 'express';
import { InterviewRepository } from './interview.repository';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { AuthMiddleware } from '../../core/middlewares/auth.middleware';
import { ValidationMiddleware } from '../../core/middlewares/validate.middleware';
import { createInterviewSchema, updateInterviewSchema } from './interview.schema';

export class InterviewRoutes {
  public router: Router;
  private interviewController: InterviewController;

  constructor() {
    this.router = Router();

    // Dependency Injection
    const interviewRepository = new InterviewRepository();
    const interviewService = new InterviewService(interviewRepository);
    this.interviewController = new InterviewController(interviewService);

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(AuthMiddleware.authenticate);

    this.router.get('/job/:jobId', this.interviewController.getByJob);
    this.router.post(
      '/',
      ValidationMiddleware.validate(createInterviewSchema),
      this.interviewController.create
    );
    this.router.put(
      '/:id',
      ValidationMiddleware.validate(updateInterviewSchema),
      this.interviewController.update
    );
    this.router.delete('/:id', this.interviewController.delete);
  }
}

export const interviewRouter = new InterviewRoutes().router;
export default interviewRouter;

