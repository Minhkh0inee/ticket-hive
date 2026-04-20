import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/auth.dto';
import { LocalAuthGuard } from './guard/local.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
type UserWithRefresh = User & { refreshToken: string };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerBody: RegisterDTO) {
    return this.authService.register(registerBody);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: User) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(@CurrentUser() user: UserWithRefresh) {
    return this.authService.refresh(user.id, user.refreshToken);
  }
}
