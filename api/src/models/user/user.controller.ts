import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@/authentication/guards/role-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { User } from '@/common/decorators/user.decorator';
import { Role } from '@/types';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Patch('/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin, Role.Teacher)
  async updateProfile(
    @Body() body: UpdateProfileDto,
    @User('userId') userId: string,
  ) {
    return await this.userService.updateOne(userId, body);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin, Role.Teacher)
  async getProfile(@User('userId') userId: string) {
    return await this.userService.getOne(userId);
  }

  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async getAllUsers(@Query() query: GetUsersDto) {
    return await this.userService.getAll(query);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async getOneUser(@Param('id') id: string) {
    return await this.userService.getOne(id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async updateOneUser(@Param('id') id: string, @Body() body: UpdateProfileDto) {
    return await this.userService.updateOne(id, body);
  }
}
