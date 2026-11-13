import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error';

export class ErrorMiddleware {
  public static handle(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        status: err.statusCode >= 500 ? 'error' : 'fail',
        message: err.message,
      });
      return;
    }

    console.error('💥 Unhandled Exception:', err);
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan internal pada server.',
    });
  }

  public static handleNotFound(req: Request, res: Response): void {
    res.status(404).json({
      status: 'fail',
      message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan`,
    });
  }
}

