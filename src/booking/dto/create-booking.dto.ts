import { IsInt, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  ma_phong: number;

  @IsDateString()
  ngay_den: string;

  @IsDateString()
  ngay_di: string;

  @IsInt()
  so_luong_khach: number;
}
