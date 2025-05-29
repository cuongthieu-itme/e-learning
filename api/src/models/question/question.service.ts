import { ResponseObject } from '@/types';
import { ForbiddenException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { CreateManyQuestionsDto } from './dto/create-many-questions.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { GenerateAiQuestionsDto } from './dto/generate-ai-questions.dto';
import { GetQuestionsDto } from './dto/get-questions.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './schema/question.schema';

@Injectable()
export class QuestionService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(QuestionService.name);

  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async find(query: FilterQuery<Question> = {}, select?: string): Promise<Question[]> {
    return await this.questionModel.find(query).select(select).lean().exec();
  }

  async countDocuments(
    query: FilterQuery<Question> = {},
    select?: string,
  ): Promise<number> {
    return await this.questionModel.countDocuments(query).select(select).exec();
  }

  async findAndUpdateMany(
    query: FilterQuery<Question> = {},
    update: UpdateQuery<Question> = {},
  ): Promise<UpdateWriteOpResult> {
    return await this.questionModel.updateMany(query, update).exec();
  }

  async findById(id: string): Promise<Question> {
    return this.questionModel.findById(id).lean().exec();
  }

  async createOne(body: CreateQuestionDto, userId: string): Promise<ResponseObject> {
    const newQuestion = await this.questionModel.create({
      ...body,
      lectureId: new Types.ObjectId(body.lectureId),
      createdById: new Types.ObjectId(userId),
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Câu hỏi đã được tạo thành công',
      question: newQuestion,
    };
  }

  async createMany(data: CreateManyQuestionsDto, userId: string): Promise<ResponseObject> {
    if (!data.questions || data.questions.length === 0) {
      throw new NotFoundException('No questions provided');
    }

    const questionsToCreate = data.questions.map(question => ({
      ...question,
      lectureId: new Types.ObjectId(question.lectureId),
      createdById: new Types.ObjectId(userId),
    }));

    const createdQuestions = await this.questionModel.insertMany(questionsToCreate);

    return {
      statusCode: HttpStatus.CREATED,
      message: `${createdQuestions.length} câu hỏi đã được tạo thành công`,
      questionsCount: createdQuestions.length,
      questions: createdQuestions,
    };
  }

  async updateOne(id: string, body: UpdateQuestionDto, userId: string): Promise<ResponseObject> {
    const question = await this.questionModel.findById(id).exec();

    if (!question) throw new NotFoundException('Question not found');

    if (question.createdById.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to update this question');
    }

    const hasChanges = Object.keys(body).some(key => body[key] !== question[key]);
    if (!hasChanges) throw new NotFoundException('Giá trị chưa thay đổi');

    const updateData: any = { ...body };
    if (body.lectureId) updateData.lectureId = new Types.ObjectId(body.lectureId);

    const updatedQuestion = await this.questionModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).exec();

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Câu hỏi đã được cập nhật thành công',
      question: updatedQuestion,
    };
  }

  async deleteOne(id: string, userId: string): Promise<ResponseObject> {
    const question = await this.questionModel.findById(id).exec();

    if (!question) throw new NotFoundException('Question not found');

    if (question.createdById.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to delete this question');
    }

    await this.questionModel.findByIdAndDelete(id).exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'Câu hỏi đã được xóa thành công',
    };
  }

  async getOne(id: string): Promise<ResponseObject> {
    const question = await this.questionModel.findById(id)
      .populate('lectureId', 'title')
      .populate('createdById', 'first_name last_name')
      .lean()
      .exec();

    if (!question) throw new NotFoundException('Question not found');

    return {
      statusCode: HttpStatus.OK,
      question,
    };
  }

  async getAll({
    page = 1,
    limit = 10,
    search,
    sort,
    lectureId,
    createdById,
  }: GetQuestionsDto): Promise<ResponseObject> {
    const conditions: any = {};

    if (search) {
      const regexSearch = new RegExp(String(search), 'i');
      conditions.$or = [
        { question: { $regex: regexSearch } },
        { optionA: { $regex: regexSearch } },
        { optionB: { $regex: regexSearch } },
        { optionC: { $regex: regexSearch } },
        { optionD: { $regex: regexSearch } },
        { explanation: { $regex: regexSearch } },
      ];
    }

    if (lectureId) {
      conditions.lectureId = new Types.ObjectId(lectureId);
    }

    if (createdById) {
      conditions.createdById = new Types.ObjectId(createdById);
    }

    const sortOptions: any = {
      createdAt: sort === 'desc' ? -1 : 1
    };

    const questions = await this.questionModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('lectureId', 'title')
      .populate('createdById', 'first_name last_name')
      .lean()
      .exec();

    const totalQuestions = await this.questionModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      questions,
      totalQuestions,
      currentPage: page,
      totalPages: Math.ceil(totalQuestions / limit),
    };
  }

  async getUserQuestions(userId: string, {
    page = 1,
    limit = 10,
    search,
    sort,
    lectureId,
  }: GetQuestionsDto): Promise<ResponseObject> {
    const conditions: any = { createdById: new Types.ObjectId(userId) };

    if (search) {
      const regexSearch = new RegExp(String(search), 'i');
      conditions.$or = [
        { question: { $regex: regexSearch } },
        { optionA: { $regex: regexSearch } },
        { optionB: { $regex: regexSearch } },
        { optionC: { $regex: regexSearch } },
        { optionD: { $regex: regexSearch } },
        { explanation: { $regex: regexSearch } },
      ];
    }

    if (lectureId) {
      conditions.lectureId = new Types.ObjectId(lectureId);
    }

    const sortOptions: any = {
      createdAt: sort === 'desc' ? -1 : 1
    };

    const questions = await this.questionModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('lectureId', 'title')
      .lean()
      .exec();

    const totalQuestions = await this.questionModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      questions,
      totalQuestions,
      currentPage: page,
      totalPages: Math.ceil(totalQuestions / limit),
    };
  }

  async getLectureQuestions(lectureId: string, {
    page = 1,
    limit = 10,
    search,
    sort,
  }: GetQuestionsDto): Promise<ResponseObject> {
    const conditions: any = {
      lectureId: new Types.ObjectId(lectureId)
    };

    if (search) {
      const regexSearch = new RegExp(String(search), 'i');
      conditions.$or = [
        { question: { $regex: regexSearch } },
        { optionA: { $regex: regexSearch } },
        { optionB: { $regex: regexSearch } },
        { optionC: { $regex: regexSearch } },
        { optionD: { $regex: regexSearch } },
        { explanation: { $regex: regexSearch } },
      ];
    }

    const sortOptions: any = {
      createdAt: sort === 'desc' ? -1 : 1
    };

    const questions = await this.questionModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const totalQuestions = await this.questionModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      questions,
      totalQuestions,
      currentPage: page,
      totalPages: Math.ceil(totalQuestions / limit),
    };
  }

  async getQuestionsForQuiz(lectureId: string, limit: number = 10): Promise<ResponseObject> {
    const conditions = {
      lectureId: new Types.ObjectId(lectureId)
    };

    const questions = await this.questionModel
      .aggregate([
        { $match: conditions },
        { $sample: { size: limit } },
        {
          $project: {
            question: 1,
            optionA: 1,
            optionB: 1,
            optionC: 1,
            optionD: 1,
          }
        }
      ])
      .exec();

    return {
      statusCode: HttpStatus.OK,
      questions,
      totalQuestions: questions.length,
    };
  }

  async checkQuizAnswers(answers: { questionId: string, answer: string }[]): Promise<ResponseObject> {
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      throw new NotFoundException('No answers provided');
    }

    const questionIds = answers.map(a => new Types.ObjectId(a.questionId));
    const questions = await this.questionModel
      .find({ _id: { $in: questionIds } })
      .lean()
      .exec();

    if (questions.length === 0) {
      throw new NotFoundException('No questions found for the provided answers');
    }

    const questionsMap = questions.reduce((acc, q) => {
      acc[q._id.toString()] = q;
      return acc;
    }, {});

    let correctCount = 0;
    const results = answers.map(answer => {
      const question = questionsMap[answer.questionId];
      if (!question) return null;

      const isCorrect = question.correctAnswer === answer.answer;
      if (isCorrect) correctCount++;

      return {
        questionId: answer.questionId,
        userAnswer: answer.answer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    }).filter(r => r !== null);

    return {
      statusCode: HttpStatus.OK,
      results,
      totalQuestions: results.length,
      correctCount,
      score: `${correctCount}/${results.length}`,
      percentage: Math.round((correctCount / results.length) * 100)
    };
  }

  async getAllQuestionsRandomByLectureId(lectureId: string): Promise<ResponseObject> {
    if (!lectureId) {
      throw new NotFoundException('Lecture ID is required');
    }

    const conditions = {
      lectureId: new Types.ObjectId(lectureId)
    };

    const totalQuestions = await this.questionModel.countDocuments(conditions);

    if (totalQuestions === 0) {
      return {
        statusCode: HttpStatus.OK,
        questions: [],
        totalQuestions: 0,
        message: 'No questions found for this lecture'
      };
    }

    const questions = await this.questionModel
      .aggregate([
        { $match: conditions },
        { $sample: { size: totalQuestions } },
        {
          $lookup: {
            from: 'users',
            localField: 'createdById',
            foreignField: '_id',
            as: 'createdBy'
          }
        },
        { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            question: 1,
            optionA: 1,
            optionB: 1,
            optionC: 1,
            optionD: 1,
            correctAnswer: 1,
            explanation: 1,
            lectureId: 1,
            createdAt: 1,
            updatedAt: 1,
            'createdBy._id': 1,
            'createdBy.first_name': 1,
            'createdBy.last_name': 1
          }
        }
      ])
      .exec();

    return {
      statusCode: HttpStatus.OK,
      questions,
      totalQuestions,
      message: 'Questions retrieved successfully'
    };
  }

  async generateAiQuestions(dto: GenerateAiQuestionsDto, userId: string): Promise<ResponseObject> {
    try {
      const { count, lectureId, lecture } = dto;

      const questions = await this.questionModel.find({ lectureId }).exec();
      if (!questions) {
        throw new NotFoundException('Lecture not found');
      }

      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: 'Bạn là một chuyên gia tạo câu hỏi giáo dục. Hãy tạo các câu hỏi giáo dục bằng tiếng Việt với đáp án dựa trên chủ đề được cung cấp. Đầu ra phải ở định dạng JSON.'
        },
        {
          role: 'user',
          content: `Tạo ${count} câu hỏi trắc nghiệm bằng tiếng Việt về "${lecture}".
          Mỗi câu hỏi phải có 4 lựa chọn (A, B, C, D) với chỉ một đáp án đúng.
          Định dạng phản hồi như một đối tượng JSON hợp lệ với mảng 'questions' chứa các đối tượng có cấu trúc sau:
          {
            "questions": [
              {
                "lectureId": "${lectureId}",
                "question": "Nội dung câu hỏi?",
                "optionA": "Nội dung lựa chọn A",
                "optionB": "Nội dung lựa chọn B",
                "optionC": "Nội dung lựa chọn C",
                "optionD": "Nội dung lựa chọn D",
                "correctAnswer": "A", // phải là một trong: A, B, C, D
                "explanation": "Giải thích tại sao đáp án này là đúng"
              }
            ]
          }`
        }
      ];

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 2500,
      });

      const content = response.choices[0].message.content;

      try {
        const parsedResponse = JSON.parse(content);
        const generatedQuestions = parsedResponse.questions || [];

        if (!generatedQuestions.length) {
          throw new Error('No questions generated in the response');
        }

        const questionsToCreate = generatedQuestions.map((q: any) => ({
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          lectureId: new Types.ObjectId(lectureId),
          createdById: new Types.ObjectId(userId)
        }));

        const createdQuestions = await this.questionModel.insertMany(questionsToCreate);

        return {
          statusCode: HttpStatus.CREATED,
          message: `${createdQuestions.length} câu hỏi đã được tạo thành công bằng AI`,
          questions: createdQuestions
        };
      } catch (parseError) {
        this.logger.error(`Failed to parse OpenAI response: ${parseError.message}`);
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Không thể phân tích cú pháp phản hồi từ AI',
          error: 'Failed to parse response',
          rawContent: content
        };
      }
    } catch (error) {
      this.logger.error(`OpenAI API error: ${error.message}`);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Lỗi khi tạo câu hỏi bằng AI',
        error: error.message
      };
    }
  }
}
