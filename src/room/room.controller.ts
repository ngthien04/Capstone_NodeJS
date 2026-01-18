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
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/config/multer.config';
import { MulterFile } from '../common/interfaces/multer-file.interface';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('size') size?: string) {
    const pageNum = page ? parseInt(page) : undefined;
    const sizeNum = size ? parseInt(size) : undefined;
    return this.roomService.findAll(pageNum, sizeNum);
  }

  @Get('by-location/:locationId')
  findByLocation(@Param('locationId') locationId: string) {
    return this.roomService.findByLocation(+locationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }

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
