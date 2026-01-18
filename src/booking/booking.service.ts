import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    //  kiểm tra phòng tồn tại
    const room = await this.prisma.phong.findUnique({
      where: { id: createBookingDto.ma_phong },
    });

    if (!room) {
      throw new NotFoundException(
        `Không tìm thấy phòng với ID: ${createBookingDto.ma_phong}`,
      );
    }

    // Validate ngày đến và ngày đi
    const ngayDen = new Date(createBookingDto.ngay_den);
    const ngayDi = new Date(createBookingDto.ngay_di);

    if (ngayDi <= ngayDen) {
      throw new BadRequestException(
        'Ngày đi phải sau ngày đến',
      );
    }

    if (ngayDen < new Date()) {
      throw new BadRequestException(
        'Ngày đến không được là ngày trong quá khứ',
      );
    }

    // Validate sl khách
    if (createBookingDto.so_luong_khach > room.khach) {
      throw new BadRequestException(
        `Số lượng khách vượt quá sức chứa của phòng (tối đa: ${room.khach})`,
      );
    }

    return this.prisma.datPhong.create({
      data: {
        ma_phong: createBookingDto.ma_phong,
        ngay_den: ngayDen,
        ngay_di: ngayDi,
        so_luong_khach: createBookingDto.so_luong_khach,
        ma_nguoi_dat: userId,
      },
      include: {
        phong: {
          include: {
            viTri: true,
          },
        },
        nguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(page?: number, size?: number) {
    if (page && size) {
      const skip = (page - 1) * size;
      const [data, total] = await Promise.all([
        this.prisma.datPhong.findMany({
          skip,
          take: size,
          include: {
            nguoiDung: true,
            phong: true,
          },
        }),
        this.prisma.datPhong.count(),
      ]);
      return {
        data,
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
      };
    }
    return this.prisma.datPhong.findMany({
      include: {
        nguoiDung: true,
        phong: true,
      },
    });
  }

  async findOne(id: number) {
    const booking = await this.prisma.datPhong.findUnique({
      where: { id },
      include: {
        nguoiDung: true,
        phong: {
          include: {
            viTri: true,
          },
        },
      },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async findByUser(userId: number) {
    return this.prisma.datPhong.findMany({
      where: { ma_nguoi_dat: userId },
      include: {
        phong: {
          include: {
            viTri: true,
          },
        },
      },
    });
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id);
    return this.prisma.datPhong.update({
      where: { id },
      data: updateBookingDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.datPhong.delete({
      where: { id },
    });
  }
}
