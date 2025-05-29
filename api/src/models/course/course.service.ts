import { ResponseObject } from '@/types';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { GetCoursesDto } from './dto/get-courses.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './schema/course.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) { }

  async find(query: FilterQuery<Course> = {}, select?: string): Promise<Course[]> {
    return await this.courseModel.find(query).select(select).lean().exec();
  }

  async countDocuments(
    query: FilterQuery<Course> = {},
    select?: string,
  ): Promise<number> {
    return await this.courseModel.countDocuments(query).select(select).exec();
  }

  async findAndUpdateMany(
    query: FilterQuery<Course> = {},
    update: UpdateQuery<Course> = {},
  ): Promise<UpdateWriteOpResult> {
    return await this.courseModel.updateMany(query, update).exec();
  }

  async findOneByIdAndUpdate(
    id: string,
    update: UpdateQuery<Course> = {},
  ): Promise<void> {
    await this.courseModel.findByIdAndUpdate(id, update).exec();
  }

  async findById(id: string): Promise<Course> {
    return this.courseModel.findById(id).lean().exec();
  }

  async createOne(body: CreateCourseDto, userId: string): Promise<ResponseObject> {
    const newCourse = await this.courseModel.create({
      ...body,
      createdById: new Types.ObjectId(userId),
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Khóa học đã được tạo thành công',
      course: newCourse,
    };
  }

  async updateOne(id: string, body: UpdateCourseDto): Promise<ResponseObject> {
    const course = await this.courseModel.findById(id).exec();

    if (!course) throw new NotFoundException('Course not found');

    const hasChanges = Object.keys(body).some(key => body[key] !== course[key]);
    if (!hasChanges) throw new NotFoundException('Giá trị chưa thay đổi');

    const updatedCourse = await this.courseModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Khóa học đã được cập nhật thành công',
      course: updatedCourse,
    };
  }

  async deleteOne(id: string): Promise<ResponseObject> {
    const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();

    if (!deletedCourse) throw new NotFoundException('Course not found');

    return {
      statusCode: HttpStatus.OK,
      message: 'Khóa học đã được xóa thành công',
    };
  }

  async getOne(id: string): Promise<ResponseObject> {
    const course = await this.courseModel.findById(id).populate('createdById', 'first_name last_name').lean().exec();

    if (!course) throw new NotFoundException('Course not found');

    return {
      statusCode: HttpStatus.OK,
      course,
    };
  }

  async getAll({
    page = 1,
    limit = 10,
    search,
    sort,
    subject,
    isPublished,
    createdById
  }: GetCoursesDto): Promise<ResponseObject> {
    const conditions: any = {};

    if (search) {
      const regexSearch = new RegExp(String(search), 'i');
      conditions.$or = [
        { name: { $regex: regexSearch } },
        { description: { $regex: regexSearch } },
        { subject: { $regex: regexSearch } },
      ];
    }

    if (subject) {
      conditions.subject = subject;
    }

    if (isPublished !== undefined) {
      conditions.isPublished = isPublished;
    }

    if (createdById) {
      conditions.createdById = new Types.ObjectId(createdById);
    }

    const sortOptions: any = { createdAt: sort === 'desc' ? -1 : 1 };

    const courses = await this.courseModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdById', 'first_name last_name')
      .lean()
      .exec();

    const totalCourses = await this.courseModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      courses,
      totalCourses,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit),
    };
  }

  async getUserCourses(userId: string, {
    page = 1,
    limit = 10,
    search,
    sort,
    isPublished,
  }: GetCoursesDto): Promise<ResponseObject> {
    const conditions: any = { createdById: userId };

    if (search) {
      const regexSearch = new RegExp(String(search), 'i');
      conditions.$or = [
        { name: { $regex: regexSearch } },
        { description: { $regex: regexSearch } },
        { subject: { $regex: regexSearch } },
      ];
    }

    if (isPublished !== undefined) {
      conditions.isPublished = isPublished;
    }

    const sortOptions: any = { createdAt: sort === 'desc' ? -1 : 1 };

    const courses = await this.courseModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const totalCourses = await this.courseModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      courses,
      totalCourses,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit),
    };
  }

  async getRandomCourses(limit: number = 3): Promise<ResponseObject> {
    const randomCourses = await this.courseModel.aggregate([
      { $match: { isPublished: true } },
      { $sample: { size: limit } },
      {
        $lookup: {
          from: 'users',
          localField: 'createdById',
          foreignField: '_id',
          as: 'instructor'
        }
      },
      { $unwind: { path: '$instructor', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'coursetopics',
          localField: '_id',
          foreignField: 'courseId',
          as: 'topics'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          subject: 1,
          price: 1,
          imageUrl: 1,
          isPublished: 1,
          createdById: 1,
          'instructor.first_name': 1,
          'instructor.last_name': 1,
          topics: 1
        }
      }
    ]).exec();

    return {
      statusCode: HttpStatus.OK,
      courses: randomCourses,
      totalCourses: randomCourses.length,
    };
  }
}
