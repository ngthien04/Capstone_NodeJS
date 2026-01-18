import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { PasswordHelper } from '../common/helpers/password.helper';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await PasswordHelper.comparePassword(
      password,
      user.pass_word,
    );

    if (!isPasswordValid) {
      return null;
    }

    // Remove password from result
    const { pass_word, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private createJwtPayload(user: any) {
    return {
      email: user.email,
      sub: user.id,
      role: user.role || 'user',
    };
  }

  private formatUserResponse(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
      avatar: user.avatar || null,
    };
  }

  async login(user: any) {
    const payload = this.createJwtPayload(user);
    const token = this.jwtService.sign(payload);
    
    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: process.env.JWT_EXPIRES_IN || '7d',
      user: this.formatUserResponse(user),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password, name, phone, birth_day, gender } = signUpDto;

    // kiểm tra email đã tồn tại
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email đã được đăng ký. Vui lòng sử dụng email khác.');
    }

    // Hash password 
    const hashedPassword = await PasswordHelper.hashPassword(password);

    // Create new user
    const newUser = await this.prisma.nguoiDung.create({
      data: {
        email,
        pass_word: hashedPassword,
        name,
        phone: phone || null,
        birth_day: birth_day || null,
        gender: gender || null,
        role: 'user',
      },
    });

    // Trả về thông tin đăng nhập
    const { pass_word, ...userWithoutPassword } = newUser;
    return this.login(userWithoutPassword);
  }
}
