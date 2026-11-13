import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { RoleType } from '@prisma/client';
import { IAuthService, IUserRepository, AuthResult } from './auth.interface';
import { RegisterDTO, LoginDTO } from './auth.schema';
import { AuthenticatedUser, JwtTokenPayload } from '../../core/types/common.types';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../core/errors/app.error';

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;
  private readonly saltRounds = 10;
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_dev_minimum_32_characters_long';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
  }

  public async register(dto: RegisterDTO): Promise<AuthResult> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('Email sudah terdaftar. Silakan gunakan email lain atau login.');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);

    // Pengguna pertama otomatis menjadi ADMIN, berikutnya USER
    const totalUsers = await this.userRepository.count();
    const role: RoleType = totalUsers === 0 ? RoleType.ADMIN : RoleType.USER;

    const newUser = await this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      role,
    });

    const authenticatedUser: AuthenticatedUser = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
    };

    const token = this.generateToken(authenticatedUser);

    return { user: authenticatedUser, token };
  }

  public async login(dto: LoginDTO): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError('Email atau password salah.');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Akun Anda dinonaktifkan. Hubungi admin.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Email atau password salah.');
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    const token = this.generateToken(authenticatedUser);

    return { user: authenticatedUser, token };
  }

  public async getProfile(userId: string): Promise<AuthenticatedUser> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Pengguna tidak ditemukan.');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }

  private generateToken(user: AuthenticatedUser): string {
    const payload: JwtTokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const options: SignOptions = {
      expiresIn: this.jwtExpiresIn as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, this.jwtSecret, options);
  }
}

