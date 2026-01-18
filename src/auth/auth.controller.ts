import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ 
    summary: 'Đăng nhập',
    description: 'Đăng nhập bằng email và mật khẩu để nhận JWT token'
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Thông tin đăng nhập',
    examples: {
      example1: {
        value: {
          email: 'test@gmail.com',
          password: '123456'
        },
        summary: 'Ví dụ đăng nhập'
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Đăng nhập thành công',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        token_type: 'Bearer',
        expires_in: '7d',
        user: {
          id: 1,
          email: 'test@gmail.com',
          name: 'Test User',
          role: 'user'
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Email hoặc mật khẩu không đúng' })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ 
    summary: 'Đăng ký tài khoản mới',
    description: 'Tạo tài khoản mới và tự động đăng nhập'
  })
  @ApiBody({ 
    type: SignUpDto,
    description: 'Thông tin đăng ký',
    examples: {
      example1: {
        value: {
          email: 'newuser@gmail.com',
          password: '123456',
          name: 'Nguyễn Ngọc Thiện',
          phone: '0123456789',
          birth_day: '2004-10-11',
          gender: 'male'
        },
        summary: 'Ví dụ đăng ký đầy đủ'
      },
      example2: {
        value: {
          email: 'user@gmail.com',
          password: '123456',
          name: 'Nguyễn Ngọc Thiện'
        },
        summary: 'Ví dụ đăng ký tối thiểu'
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Đăng ký thành công',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        token_type: 'Bearer',
        expires_in: '7d',
        user: {
          id: 1,
          email: 'newuser@gmail.com',
          name: 'Nguyễn Ngọc Thiện',
          role: 'user'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Email đã được đăng ký' })
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
