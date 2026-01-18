import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  ten_phong: string;

  @IsInt()
  khach: number;

  @IsInt()
  phong_ngu: number;

  @IsInt()
  giuong: number;

  @IsInt()
  phong_tam: number;

  @IsString()
  @IsOptional()
  mo_ta?: string;

  @IsInt()
  gia_tien: number;

  @IsBoolean()
  may_giat: boolean;

  @IsBoolean()
  ban_la: boolean;

  @IsBoolean()
  tivi: boolean;

  @IsBoolean()
  dieu_hoa: boolean;

  @IsBoolean()
  wifi: boolean;

  @IsBoolean()
  bep: boolean;

  @IsBoolean()
  do_xe: boolean;

  @IsBoolean()
  ho_boi: boolean;

  @IsBoolean()
  ban_ui: boolean;

  @IsInt()
  ma_vi_tri: number;

  @IsOptional()
  @IsString()
  hinh_anh?: string;
}
