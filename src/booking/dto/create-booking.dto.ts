import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 1, description: 'Mã phòng (id phòng)' })
  @IsInt()
  ma_phong: number;

  @ApiProperty({ example: '2026-02-03', description: 'Ngày đến (YYYY-MM-DD)' })
  @IsDateString()
  ngay_den: string;

  @ApiProperty({ example: '2026-02-05', description: 'Ngày đi (YYYY-MM-DD) - phải sau ngày đến' })
  @IsDateString()
  ngay_di: string;

  @ApiProperty({ example: 2, description: 'Số lượng khách' })
  @IsInt()
  so_luong_khach: number;
}
