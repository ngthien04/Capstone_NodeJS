import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'Email đăng ký',
    example: 'test@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu (tối thiểu 6 ký tự)',
    example: '123456',
    minLength: 6,
    required: true,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Họ và tên',
    example: 'Nguyễn Ngọc Thiện',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Ngày sinh',
    example: '2004-10-11',
    required: false,
  })
  @IsString()
  @IsOptional()
  birth_day?: string;

  @ApiProperty({
    description: 'Giới tính',
    example: 'male',
    enum: ['male', 'female', 'other'],
    required: false,
  })
  @IsString()
  @IsOptional()
  gender?: string;
}
