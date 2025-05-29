import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@/authentication/guards/role-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { User } from '@/common/decorators/user.decorator';
import { Role } from '@/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { GetLecturesDto } from './dto/get-lectures.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { LectureService } from './lecture.service';

@Controller('/lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async createLecture(
    @Body() body: CreateLectureDto,
    @User('userId') userId: string,
  ) {
    return await this.lectureService.createOne(body, userId);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async updateLecture(
    @Param('id') id: string,
    @Body() body: UpdateLectureDto,
    @User('userId') userId: string,
  ) {
    return await this.lectureService.updateOne(id, body, userId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async deleteLecture(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    return await this.lectureService.deleteOne(id, userId);
  }

  @Get('/my-lectures')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async getUserLectures(
    @User('userId') userId: string,
    @Query() query: GetLecturesDto,
  ) {
    return await this.lectureService.getUserLectures(userId, query);
  }

  @Get('/course/:courseId')
  @UseGuards(JwtAuthGuard)
  async getCourseLectures(
    @Param('courseId') courseId: string,
    @Query() query: GetLecturesDto,
  ) {
    return await this.lectureService.getCourseLectures(courseId, query);
  }

  @Get('/public/course/:courseId')
  async getPublicCourseLectures(
    @Param('courseId') courseId: string,
    @Query() query: GetLecturesDto,
  ) {
    return await this.lectureService.getPublicCourseLectures(courseId, query);
  }

  @Patch('/:id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async publishLecture(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    return await this.lectureService.publishLecture(id, userId);
  }

  @Patch('/:id/unpublish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async unpublishLecture(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    return await this.lectureService.unpublishLecture(id, userId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getLecture(@Param('id') id: string) {
    return await this.lectureService.getOne(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllLectures(@Query() query: GetLecturesDto) {
    return await this.lectureService.getAll(query);
  }
}
