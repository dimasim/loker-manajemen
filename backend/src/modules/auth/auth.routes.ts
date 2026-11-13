import { Router } from 'express';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ValidationMiddleware } from '../../core/middlewares/validate.middleware';
import { AuthMiddleware } from '../../core/middlewares/auth.middleware';
import { registerSchema, loginSchema } from './auth.schema';

export class AuthRoutes {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();

    // Dependency Injection: Repository -> Service -> Controller
    const authRepository = new AuthRepository();
    const authService = new AuthService(authRepository);
    this.authController = new AuthController(authService);

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/register',
      ValidationMiddleware.validate(registerSchema),
      this.authController.register
    );

    this.router.post(
      '/login',
      ValidationMiddleware.validate(loginSchema),
      this.authController.login
    );

    this.router.get(
      '/me',
      AuthMiddleware.authenticate,
      this.authController.getMe
    );
  }
}

export const authRouter = new AuthRoutes().router;
export default authRouter;

