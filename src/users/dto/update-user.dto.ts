import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyễn Ngọc Thiện', description: 'Tên người dùng' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'thien@gmail.com', description: 'Email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '0123456789', description: 'Số điện thoại' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '2004-10-11', description: 'Ngày sinh' })
  @IsString()
  @IsOptional()
  birth_day?: string;

  @ApiPropertyOptional({ example: 'male', description: 'Giới tính' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: 'user', description: "Role: 'user' | 'admin'" })
  @IsString()
  @IsOptional()
  role?: string;
}
