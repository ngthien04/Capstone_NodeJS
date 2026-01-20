import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Homestay Đà Nẵng view biển', description: 'Tên phòng' })
  @IsString()
  ten_phong: string;

  @ApiProperty({ example: 4, description: 'Số khách tối đa' })
  @IsInt()
  khach: number;

  @ApiProperty({ example: 2, description: 'Số phòng ngủ' })
  @IsInt()
  phong_ngu: number;

  @ApiProperty({ example: 2, description: 'Số giường' })
  @IsInt()
  giuong: number;

  @ApiProperty({ example: 1, description: 'Số phòng tắm' })
  @IsInt()
  phong_tam: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Gần biển, đầy đủ tiện nghi', description: 'Mô tả' })
  mo_ta?: string;

  @ApiProperty({ example: 800000, description: 'Giá tiền' })
  @IsInt()
  gia_tien: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  may_giat: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  ban_la: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  tivi: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  dieu_hoa: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  wifi: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  bep: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  do_xe: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  ho_boi: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  ban_ui: boolean;

  @ApiProperty({ example: 1, description: 'Mã vị trí (id vị trí)' })
  @IsInt()
  ma_vi_tri: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: null, description: 'Hình ảnh (string path/url)' })
  hinh_anh?: string;
}
