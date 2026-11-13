import { RoleType } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: RoleType;
}

export interface JwtTokenPayload {
  id: string;
  email: string;
  role: RoleType;
  iat?: number;
  exp?: number;
}

