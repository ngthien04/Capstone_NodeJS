import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordHelper } from '../common/helpers/password.helper';

@Injectable()
export class UsersService {
  private readonly userSelectFields = {
    id: true,
    email: true,
    name: true,
    phone: true,
    birth_day: true,
    gender: true,
    role: true,
    avatar: true,
  };

  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.nguoiDung.findMany({
      select: this.userSelectFields,
      orderBy: {
        id: 'desc',
      },
    });
    return users;
  }

  async create(data: any) {
    if (data.pass_word) {
      data.pass_word = await PasswordHelper.hashPassword(data.pass_word);
    }

    const user = await this.prisma.nguoiDung.create({
      data,
      select: this.userSelectFields,
    });

    return user;
  }

  async findOne(id: number) {
    const user = await this.prisma.nguoiDung.findUnique({
      where: { id },
      select: this.userSelectFields,
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID: ${id}`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.nguoiDung.findUnique({
      where: { email },
    });
  }

  async update(id: number, data: any) {
    // kiểm tra user tồn tại
    await this.findOne(id);

    if (data.pass_word) {
      data.pass_word = await PasswordHelper.hashPassword(data.pass_word);
    }

    return this.prisma.nguoiDung.update({
      where: { id },
      data,
      select: this.userSelectFields,
    });
  }

  async remove(id: number) {
    // kiểm tra user tồn tại
    await this.findOne(id);

    return this.prisma.nguoiDung.delete({
      where: { id },
      select: this.userSelectFields,
    });
  }

  async searchByName(name: string) {
    return this.prisma.nguoiDung.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      select: this.userSelectFields,
    });
  }

  async uploadAvatar(userId: number, avatarPath: string) {
    await this.findOne(userId);

    return this.prisma.nguoiDung.update({
      where: { id: userId },
      data: { avatar: avatarPath },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
  }
}
