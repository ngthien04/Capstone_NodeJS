import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ example: 'Đà Nẵng', description: 'Tên vị trí' })
  @IsString()
  ten_vi_tri: string;

  @ApiProperty({ example: 'Đà Nẵng', description: 'Tỉnh/Thành' })
  @IsString()
  tinh_thanh: string;

  @ApiProperty({ example: 'Việt Nam', description: 'Quốc gia' })
  @IsString()
  quoc_gia: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: null, description: 'Link ảnh (nếu có)' })
  hinh_anh?: string;
}
