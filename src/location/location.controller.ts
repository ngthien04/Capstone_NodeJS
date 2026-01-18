import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/config/multer.config';
import { MulterFile } from '../common/interfaces/multer-file.interface';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @ApiOperation({ summary: 'Tạo vị trí mới (Admin only)' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Tạo vị trí thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền admin' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @ApiOperation({ summary: 'Lấy danh sách vị trí' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Số trang (bắt đầu từ 1)', example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, description: 'Số lượng item mỗi trang', example: 10 })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @Get()
  findAll(@Query('page') page?: string, @Query('size') size?: string) {
    const pageNum = page ? parseInt(page) : undefined;
    const sizeNum = size ? parseInt(size) : undefined;
    return this.locationService.findAll(pageNum, sizeNum);
  }

  @Get('paginate')
  paginate(@Query('page') page?: string, @Query('size') size?: string) {
    const pageNum = page ? parseInt(page) : 1;
    const sizeNum = size ? parseInt(size) : 10;
    return this.locationService.findAll(pageNum, sizeNum);
  }

  @ApiOperation({ summary: 'Lấy thông tin vị trí theo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID của vị trí', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vị trí' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }

  @ApiOperation({ summary: 'Upload ảnh cho vị trí (Admin only)' })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'locationId', type: Number, description: 'ID của vị trí', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File ảnh (jpg, jpeg, png, gif, webp) - tối đa 5MB'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Upload ảnh thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền admin' })
  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadImage(@Query('locationId') locationId: string, @UploadedFile() file: MulterFile | undefined) {
    if (!file) {
      throw new Error('Vui lòng chọn file để upload');
    }
    const imagePath = file.filename || file.originalname;
    return this.locationService.uploadImage(+locationId, imagePath);
  }
}
