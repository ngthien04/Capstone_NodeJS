import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsString, IsDateString, Min, Max, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 1, description: 'Mã phòng (id phòng)' })
  @IsInt()
  ma_phong: number;

  @IsOptional()
  @IsDateString()
  ngay_binh_luan: string;

  @ApiProperty({ example: 'Phòng rất sạch sẽ, thoáng mát, sẽ quay lại!', description: 'Nội dung (>= 10 ký tự)' })
  @IsString()
  noi_dung: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5, description: 'Số sao (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  sao_binh_luan: number;
}
