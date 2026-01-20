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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/config/multer.config';
import { MulterFile } from '../common/interfaces/multer-file.interface';

@ApiTags('Room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: 'Tạo phòng' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Tạo phòng thành công' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @ApiOperation({ summary: 'Lấy danh sách phòng' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @Get()
  findAll(@Query('page') page?: string, @Query('size') size?: string) {
    const pageNum = page ? parseInt(page) : undefined;
    const sizeNum = size ? parseInt(size) : undefined;
    return this.roomService.findAll(pageNum, sizeNum);
  }

  @ApiOperation({ summary: 'Lấy phòng theo vị trí' })
  @ApiParam({ name: 'locationId', type: Number })
  @Get('by-location/:locationId')
  findByLocation(@Param('locationId') locationId: string) {
    return this.roomService.findByLocation(+locationId);
  }

  @ApiOperation({ summary: 'Lấy phòng theo ID' })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @ApiOperation({ summary: 'Cập nhật phòng' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', type: Number })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @ApiOperation({ summary: 'Xoá phòng' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }

  @ApiOperation({ summary: 'Upload ảnh phòng' })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'roomId', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadImage(@Query('roomId') roomId: string, @UploadedFile() file: MulterFile | undefined) {
    if (!file) {
      throw new Error('Vui lòng chọn file để upload');
    }
    const imagePath = file.filename || file.originalname;
    return this.roomService.uploadImage(+roomId, imagePath);
  }
}
