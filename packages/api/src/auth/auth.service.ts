import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashingPassword, IsMatchHashedPassword } from 'src/utils/bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IPayload } from './dto/auth.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ){}

    async register(body: RegisterDTO) {
        const user = await this.usersService.create(body);
        const accessToken = this.generateAccessToken(user);
        return { user, accessToken }; 
    }

    async login(user: User) {
        const accessToken = this.generateAccessToken(user);
        return { accessToken };
      }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.usersService.findOneByEmailWithPassword(email);
        if (!user) return null;
        
        const isMatch = await IsMatchHashedPassword(password, user.passwordHash);
        if (!isMatch) return null;
      
        const { passwordHash, ...result } = user;
        return result as User;
      }

    private generateAccessToken(payload: IPayload): string {
        return this.jwtService.sign({ sub: payload.id, email: payload.email });
    }
}
