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
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({ summary: 'Tạo đặt phòng' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Tạo booking thành công' })
  @ApiResponse({ status: 401, description: 'Unauthorized (chưa Authorize token)' })
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    const userId = req.user.userId;
    return this.bookingService.create(createBookingDto, userId);
  }

  @ApiOperation({ summary: 'Lấy danh sách booking' })
  @ApiBearerAuth('JWT-auth')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('page') page?: string, @Query('size') size?: string, @Request() req?) {
    const currentUser = req.user;
    const pageNum = page ? parseInt(page) : undefined;
    const sizeNum = size ? parseInt(size) : undefined;
    if (currentUser.role === 'admin') {
      return this.bookingService.findAll(pageNum, sizeNum);
    }
    return this.bookingService.findByUser(currentUser.userId);
  }

  @ApiOperation({ summary: 'Lấy booking theo userId' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'userId', type: Number })
  @Get('by-user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findByUser(@Param('userId') userId: string) {
    return this.bookingService.findByUser(+userId);
  }

  @ApiOperation({ summary: 'Lấy booking theo id' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @ApiOperation({ summary: 'Cập nhật booking' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', type: Number })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto, @Request() req) {
    const currentUser = req.user;
    const bookingId = +id;
    return this.bookingService.updateWithOwnershipCheck(bookingId, updateBookingDto, currentUser);
  }

  @ApiOperation({ summary: 'Xoá booking' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
