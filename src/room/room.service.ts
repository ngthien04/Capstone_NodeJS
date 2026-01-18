import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    return this.prisma.phong.create({
      data: createRoomDto,
    });
  }

  async findAll(page?: number, size?: number) {
    if (page && size) {
      const skip = (page - 1) * size;
      const [data, total] = await Promise.all([
        this.prisma.phong.findMany({
          skip,
          take: size,
          include: {
            viTri: {
              select: {
                id: true,
                ten_vi_tri: true,
                tinh_thanh: true,
                quoc_gia: true,
                hinh_anh: true,
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
        }),
        this.prisma.phong.count(),
      ]);
      return {
        data,
        pagination: {
          total,
          page,
          size,
          totalPages: Math.ceil(total / size),
        },
      };
    }
    return this.prisma.phong.findMany({
      include: {
        viTri: {
          select: {
            id: true,
            ten_vi_tri: true,
            tinh_thanh: true,
            quoc_gia: true,
            hinh_anh: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.phong.findUnique({
      where: { id },
      include: {
        viTri: true,
        datPhong: true,
        binhLuan: true,
      },
    });
    if (!room) {
      throw new NotFoundException(`không tìm thấy phòng với ID ${id}`);
    }
    return room;
  }

  async findByLocation(locationId: number) {
    return this.prisma.phong.findMany({
      where: { ma_vi_tri: locationId },
      include: {
        viTri: true,
      },
    });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    await this.findOne(id);
    return this.prisma.phong.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.phong.delete({
      where: { id },
    });
  }

  async uploadImage(id: number, imagePath: string) {
    await this.findOne(id);
    return this.prisma.phong.update({
      where: { id },
      data: { hinh_anh: imagePath },
    });
  }
}
