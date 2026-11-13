import { PrismaClient, User, RoleType } from '@prisma/client';
import { IUserRepository, UserWithoutPassword } from './auth.interface';
import { DatabaseClient } from '../../core/database/prisma.client';

export class AuthRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance || DatabaseClient.getInstance();
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  public async findById(id: string): Promise<UserWithoutPassword | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  public async create(data: {
    fullName: string;
    email: string;
    passwordHash: string;
    role: RoleType;
  }): Promise<UserWithoutPassword> {
    return this.prisma.user.create({
      data: {
        fullName: data.fullName.trim(),
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        role: data.role,
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  public async count(): Promise<number> {
    return this.prisma.user.count();
  }
}

