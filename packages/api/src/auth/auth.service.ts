import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { IsMatchHashedPassword } from 'src/utils/bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { IPayload } from './dto/auth.interface';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) {
    const refreshSecret = configService.get<string>('JWT_REFRESH_SECRET');
    const accessSecret = configService.get<string>('JWT_SECRET');
    if (!refreshSecret || !accessSecret) {
      throw new Error('JWT secrets are not defined');
    }
  }

  async register(body: RegisterDTO) {
    const user = await this.usersService.create(body);
    const accessToken = this.generateAccessToken(user);
    return { user, accessToken };
  }

  async login(user: User) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.redisService.setRefreshToken(user.id, refreshToken, 60 * 60 * 24 * 7);
    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmailWithPassword(email);
    if (!user) return null;

    const isMatch = await IsMatchHashedPassword(password, user.passwordHash);
    if (!isMatch) return null;

    const { passwordHash, ...result } = user;
    return result as User;
  }

  async refresh(userId: string, refreshToken: string) {
    const stored = await this.redisService.getRefreshToken(userId);
    if (!stored) throw new UnauthorizedException('Refresh token expired');

    if (stored !== refreshToken) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.usersService.findOneById(userId);
    const accessToken = this.generateAccessToken(user);
    return { accessToken };
  }

  async logout(userId: string) {
    await this.redisService.deleteRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

  private generateAccessToken(payload: IPayload): string {
    return this.jwtService.sign(
      { sub: payload.id, email: payload.email },
      {
        secret: this.configService.get<string>('JWT_SECRET')!,
        expiresIn: '15m',
      },
    );
  }

  private generateRefreshToken(payload: IPayload): string {
    return this.jwtService.sign(
      { sub: payload.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
        expiresIn: '7d',
      },
    );
  }
}
