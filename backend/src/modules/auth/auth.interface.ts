import { User, RoleType } from '@prisma/client';
import { AuthenticatedUser } from '../../core/types/common.types';
import { RegisterDTO, LoginDTO } from './auth.schema';

export interface UserWithoutPassword {
  id: string;
  fullName: string;
  email: string;
  role: RoleType;
  isActive: boolean;
  createdAt: Date;
}

export interface AuthResult {
  user: AuthenticatedUser;
  token: string;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<UserWithoutPassword | null>;
  create(data: { fullName: string; email: string; passwordHash: string; role: RoleType }): Promise<UserWithoutPassword>;
  count(): Promise<number>;
}

export interface IAuthService {
  register(dto: RegisterDTO): Promise<AuthResult>;
  login(dto: LoginDTO): Promise<AuthResult>;
  getProfile(userId: string): Promise<AuthenticatedUser>;
}

