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
import { CreateManyQuestionsDto } from './dto/create-many-questions.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GenerateAiQuestionsDto } from './dto/generate-ai-questions.dto';
import { GetQuestionsDto } from './dto/get-questions.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionService } from './question.service';

@Controller('/question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async createQuestion(
    @Body() body: CreateQuestionDto,
    @User('userId') userId: string,
  ) {
    return await this.questionService.createOne(body, userId);
  }

  @Post('/batch')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async createManyQuestions(
    @Body() data: CreateManyQuestionsDto,
    @User('userId') userId: string,
  ) {
    return await this.questionService.createMany(data, userId);
  }

  @Post('/generate-ai')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async generateAiQuestions(
    @Body() data: GenerateAiQuestionsDto,
    @User('userId') userId: string,
  ) {
    return await this.questionService.generateAiQuestions(data, userId);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async updateQuestion(
    @Param('id') id: string,
    @Body() body: UpdateQuestionDto,
    @User('userId') userId: string,
  ) {
    return await this.questionService.updateOne(id, body, userId);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async deleteQuestion(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    return await this.questionService.deleteOne(id, userId);
  }

  @Get('/my-questions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Teacher)
  async getUserQuestions(
    @User('userId') userId: string,
    @Query() query: GetQuestionsDto,
  ) {
    return await this.questionService.getUserQuestions(userId, query);
  }

  @Get('/lecture/:lectureId')
  @UseGuards(JwtAuthGuard)
  async getLectureQuestions(
    @Param('lectureId') lectureId: string,
    @Query() query: GetQuestionsDto,
  ) {
    return await this.questionService.getLectureQuestions(lectureId, query);
  }

  @Get('/quiz/:lectureId')
  @UseGuards(JwtAuthGuard)
  async getQuestionsForQuiz(
    @Param('lectureId') lectureId: string,
    @Query('limit') limit: number,
  ) {
    return await this.questionService.getQuestionsForQuiz(lectureId, limit);
  }

  @Get('/random-all/:lectureId')
  @UseGuards(JwtAuthGuard)
  async getAllQuestionsRandomByLectureId(
    @Param('lectureId') lectureId: string,
  ) {
    return await this.questionService.getAllQuestionsRandomByLectureId(lectureId);
  }

  @Post('/check-answers')
  @UseGuards(JwtAuthGuard)
  async checkQuizAnswers(
    @Body() answers: { questionId: string, answer: string }[],
  ) {
    return await this.questionService.checkQuizAnswers(answers);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getQuestion(@Param('id') id: string) {
    return await this.questionService.getOne(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllQuestions(@Query() query: GetQuestionsDto) {
    return await this.questionService.getAll(query);
  }
}
