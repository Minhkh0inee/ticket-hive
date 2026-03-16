import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashingPassword } from 'src/utils/bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService
    ){}

    async register(body: RegisterDTO) {
        const hashed = await hashingPassword(body.password)
   
        return 'Function'
    }
}
