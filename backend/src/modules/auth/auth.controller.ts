import { Request, Response, NextFunction } from 'express';
import { IAuthService } from './auth.interface';
import { RegisterDTO, LoginDTO } from './auth.schema';

export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  public register = async (
    req: Request<{}, {}, RegisterDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({
        status: 'success',
        message: 'Registrasi berhasil',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (
    req: Request<{}, {}, LoginDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json({
        status: 'success',
        message: 'Login berhasil',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.authService.getProfile(req.user!.id);
      res.status(200).json({
        status: 'success',
        message: 'Profil berhasil diambil',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  };
}

