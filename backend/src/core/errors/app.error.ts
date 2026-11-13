export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Permintaan tidak valid') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Akses tidak diizinkan. Silakan login terlebih dahulu.') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Akses terlarang. Anda tidak memiliki izin.') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource yang diminta tidak ditemukan') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Data sudah ada atau terjadi konflik') {
    super(message, 409);
  }
}

