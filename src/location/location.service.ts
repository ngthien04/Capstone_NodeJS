import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async create(createLocationDto: CreateLocationDto) {
    return this.prisma.viTri.create({
      data: createLocationDto,
    });
  }

  async findAll(page?: number, size?: number) {
    if (page && size) {
      const skip = (page - 1) * size;
      const [data, total] = await Promise.all([
        this.prisma.viTri.findMany({
          skip,
          take: size,
          orderBy: {
            id: 'desc',
          },
        }),
        this.prisma.viTri.count(),
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
    return this.prisma.viTri.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const location = await this.prisma.viTri.findUnique({
      where: { id },
      include: {
        phong: true,
      },
    });
    if (!location) {
      throw new NotFoundException(`Không tìm thấy vị trí với ID ${id}`);
    }
    return location;
  }

  async update(id: number, updateLocationDto: UpdateLocationDto) {
    await this.findOne(id);
    return this.prisma.viTri.update({
      where: { id },
      data: updateLocationDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.viTri.delete({
      where: { id },
    });
  }

  async uploadImage(id: number, imagePath: string) {
    await this.findOne(id);
    return this.prisma.viTri.update({
      where: { id },
      data: { hinh_anh: imagePath },
    });
  }
}
