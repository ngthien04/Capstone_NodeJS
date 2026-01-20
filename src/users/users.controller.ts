import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { multerConfig } from '../common/config/multer.config';
import { MulterFile } from '../common/interfaces/multer-file.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Tạo user' })
  @ApiBearerAuth('JWT-auth')
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Xóa user' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', type: Number, description: 'ID user cần xóa' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID của người dùng', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const currentUser = req.user;
    const targetId = +id;
    if (currentUser.role !== 'admin' && currentUser.userId !== targetId) {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật tài khoản của chính mình');
    }
    return this.usersService.update(targetId, updateUserDto);
  }

  @Get('search/:TenNguoiDung')
  searchByName(@Param('TenNguoiDung') name: string) {
    return this.usersService.searchByName(name);
  }

  @ApiOperation({ summary: 'Upload avatar cho người dùng hiện tại' })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        formFile: {
          type: 'string',
          format: 'binary',
          description: 'File ảnh avatar (jpg, jpeg, png, gif, webp) - tối đa 5MB'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Upload avatar thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('formFile', multerConfig))
  async uploadAvatar(
    @UploadedFile() file: MulterFile | undefined,
    @Request() req,
  ) {
    if (!file) {
      throw new Error('Vui lòng chọn file để upload');
    }

    const userId = req.user.userId;
    const avatarPath = `/uploads/${file.filename}`;
    
    return this.usersService.uploadAvatar(userId, avatarPath);
  }
}
