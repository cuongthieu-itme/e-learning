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

import { CourseTopicService } from './course-topic.service';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@/authentication/guards/role-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/types';
import { User } from '@/common/decorators/user.decorator';

import { CreateCourseTopicDto } from './dto/create-course-topic.dto';
import { UpdateCourseTopicDto } from './dto/update-course-topic.dto';
import { GetCourseTopicsDto } from './dto/get-course-topics.dto';

@Controller('/course-topic')
export class CourseTopicController {
  constructor(private readonly courseTopicService: CourseTopicService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager, Role.Teacher)
  async createCourseTopic(@Body() body: CreateCourseTopicDto) {
    return await this.courseTopicService.createOne(body);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager, Role.Teacher)
  async updateCourseTopic(
    @Param('id') id: string,
    @Body() body: UpdateCourseTopicDto,
  ) {
    return await this.courseTopicService.updateOne(id, body);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager, Role.Teacher)
  async deleteCourseTopic(@Param('id') id: string) {
    return await this.courseTopicService.deleteOne(id);
  }

  @Get('/by-course/:courseId')
  @UseGuards(JwtAuthGuard)
  async getCourseTopicsByCourse(@Param('courseId') courseId: string) {
    return await this.courseTopicService.getCourseTopics(courseId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getCourseTopic(@Param('id') id: string) {
    return await this.courseTopicService.getOne(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllCourseTopics(@Query() query: GetCourseTopicsDto) {
    return await this.courseTopicService.getAll(query);
  }
}
