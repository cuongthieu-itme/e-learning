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

import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@/authentication/guards/role-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { User } from '@/common/decorators/user.decorator';
import { Role } from '@/types';
import { CourseService } from './course.service';

import { CreateCourseDto } from './dto/create-course.dto';
import { GetCoursesDto } from './dto/get-courses.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('/course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  async createCourse(
    @Body() body: CreateCourseDto,
    @User('userId') userId: string,
  ) {
    return await this.courseService.createOne(body, userId);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  async updateCourse(
    @Param('id') id: string,
    @Body() body: UpdateCourseDto,
  ) {
    return await this.courseService.updateOne(id, body);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  async deleteCourse(@Param('id') id: string) {
    return await this.courseService.deleteOne(id);
  }

  @Get('/my-courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Manager)
  async getUserCourses(
    @User('userId') userId: string,
    @Query() query: GetCoursesDto,
  ) {
    return await this.courseService.getUserCourses(userId, query);
  }

  @Get('/random')
  async getRandomCourses() {
    return await this.courseService.getRandomCourses();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getCourse(@Param('id') id: string) {
    return await this.courseService.getOne(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllCourses(@Query() query: GetCoursesDto) {
    return await this.courseService.getAll(query);
  }
}
