import { IsString, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  ten_vi_tri: string;

  @IsString()
  tinh_thanh: string;

  @IsString()
  quoc_gia: string;

  @IsString()
  @IsOptional()
  hinh_anh?: string;
}
