import { IsInt, IsString, IsDateString, Min, Max } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  ma_phong: number;

  @IsDateString()
  ngay_binh_luan: string;

  @IsString()
  noi_dung: string;

  @IsInt()
  @Min(1)
  @Max(5)
  sao_binh_luan: number;
}
