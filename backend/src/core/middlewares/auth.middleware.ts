import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RoleType } from '@prisma/client';
import { JwtTokenPayload } from '../types/common.types';
import { DatabaseClient } from '../database/prisma.client';
import { UnauthorizedError, ForbiddenError } from '../errors/app.error';

export class AuthMiddleware {
  public static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Akses ditolak. Token autentikasi tidak ditemukan.');
      }

      const token = authHeader.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_dev_minimum_32_characters_long';

      const decoded = jwt.verify(token, jwtSecret) as JwtTokenPayload;

      const prisma = DatabaseClient.getInstance();
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, fullName: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedError('Akun pengguna tidak ditemukan atau telah dinonaktifkan.');
      }

      req.user = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        next(new UnauthorizedError('Sesi telah berakhir. Silakan login kembali.'));
        return;
      }
      if (error instanceof jwt.JsonWebTokenError) {
        next(new UnauthorizedError('Token tidak valid.'));
        return;
      }
      next(error);
    }
  }

  public static authorize(allowedRoles: RoleType[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        next(new UnauthorizedError('Pengguna belum terautentikasi.'));
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        next(new ForbiddenError('Anda tidak memiliki izin untuk mengakses resource ini.'));
        return;
      }

      next();
    };
  }
}

