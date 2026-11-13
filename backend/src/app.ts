import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes';
import { platformRouter } from './modules/platforms/platform.routes';
import { jobRouter } from './modules/jobs/job.routes';
import { interviewRouter } from './modules/interviews/interview.routes';
import { ErrorMiddleware } from './core/middlewares/error.middleware';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    // Healthcheck
    this.app.get('/api/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'ok',
        service: 'loker-tracker-backend',
        architecture: 'Modular OOP (Domain-Driven Modules)',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    // Domain Modules
    this.app.use('/api/auth', authRouter);
    this.app.use('/api/platforms', platformRouter);
    this.app.use('/api/jobs', jobRouter);
    this.app.use('/api/interviews', interviewRouter);
  }

  private configureErrorHandling(): void {
    // 404 handler
    this.app.use(ErrorMiddleware.handleNotFound);

    // Global error handler
    this.app.use(ErrorMiddleware.handle);
  }
}

export default new App().app;
