import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    // kiểm tra phòng tồn tại
    const room = await this.prisma.phong.findUnique({
      where: { id: createCommentDto.ma_phong },
    });

    if (!room) {
      throw new NotFoundException(
        `Không tìm thấy phòng với ID: ${createCommentDto.ma_phong}`,
      );
    }

    // sử dụng ngày hiện tại nếu không có ngày bình luận được cung cấp
    const ngayBinhLuan = createCommentDto.ngay_binh_luan
      ? new Date(createCommentDto.ngay_binh_luan)
      : new Date();

    // Validate độ dài comment 
    if (createCommentDto.noi_dung.trim().length < 10) {
      throw new BadRequestException(
        'Nội dung bình luận phải có ít nhất 10 ký tự',
      );
    }

    return this.prisma.binhLuan.create({
      data: {
        ma_phong: createCommentDto.ma_phong,
        ngay_binh_luan: ngayBinhLuan,
        noi_dung: createCommentDto.noi_dung.trim(),
        sao_binh_luan: createCommentDto.sao_binh_luan,
        ma_nguoi_binh_luan: userId,
      },
      include: {
        nguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        phong: {
          select: {
            id: true,
            ten_phong: true,
          },
        },
      },
    });
  }

  async findAll(page?: number, size?: number) {
    if (page && size) {
      const skip = (page - 1) * size;
      const [data, total] = await Promise.all([
        this.prisma.binhLuan.findMany({
          skip,
          take: size,
          include: {
            nguoiDung: true,
            phong: true,
          },
        }),
        this.prisma.binhLuan.count(),
      ]);
      return {
        data,
        total,
        page,
        size,
        totalPages: Math.ceil(total / size),
      };
    }
    return this.prisma.binhLuan.findMany({
      include: {
        nguoiDung: true,
        phong: true,
      },
    });
  }

  async findOne(id: number) {
    const comment = await this.prisma.binhLuan.findUnique({
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
    if (!comment) {
      throw new NotFoundException(`Không tìm thấy bình luận với ID ${id}`);
    }
    return comment;
  }

  async findByRoom(roomId: number) {
    return this.prisma.binhLuan.findMany({
      where: { ma_phong: roomId },
      include: {
        nguoiDung: true,
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.binhLuan.findMany({
      where: { ma_nguoi_binh_luan: userId },
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
            avatar: true,
          },
        },
      },
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.findOne(id);
    return this.prisma.binhLuan.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  // Chỉ owner hoặc admin được phép cập nhật comment
  async updateWithOwnershipCheck(
    id: number,
    updateCommentDto: UpdateCommentDto,
    currentUser: { userId: number; role: string },
  ) {
    const comment = await this.findOne(id);
    if (
      currentUser.role !== 'admin' &&
      comment.nguoiDung &&
      comment.nguoiDung.id !== currentUser.userId
    ) {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật bình luận của chính mình');
    }
    return this.update(id, updateCommentDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.binhLuan.delete({
      where: { id },
    });
  }
}
