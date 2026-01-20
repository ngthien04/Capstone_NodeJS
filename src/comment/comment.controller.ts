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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Tạo bình luận' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({ status: 201, description: 'Tạo comment thành công' })
  @ApiResponse({ status: 401, description: 'Unauthorized (chưa Authorize token)' })
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const userId = req.user.userId;
    return this.commentService.create(createCommentDto, userId);
  }

  @ApiOperation({ summary: 'Lấy danh sách comment' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @Get()
  findAll(@Query('page') page?: string, @Query('size') size?: string) {
    const pageNum = page ? parseInt(page) : undefined;
    const sizeNum = size ? parseInt(size) : undefined;
    return this.commentService.findAll(pageNum, sizeNum);
  }

  @ApiOperation({ summary: 'Lấy comment theo roomId' })
  @ApiParam({ name: 'roomId', type: Number })
  @Get('room/:roomId')
  findByRoom(@Param('roomId') roomId: string) {
    return this.commentService.findByRoom(+roomId);
  }

  @ApiOperation({ summary: 'Lấy comment theo id' })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @ApiOperation({ summary: 'Cập nhật comment' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', type: Number })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    const currentUser = req.user;
    const commentId = +id;
    return this.commentService.updateWithOwnershipCheck(commentId, updateCommentDto, currentUser);
  }

  @ApiOperation({ summary: 'Xoá comment' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
