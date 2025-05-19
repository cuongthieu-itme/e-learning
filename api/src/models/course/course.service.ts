import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery, UpdateWriteOpResult, Types } from 'mongoose';

import { Course } from './schema/course.schema';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { GetCoursesDto } from './dto/get-courses.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) {}

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
      message: 'Course created successfully',
      course: newCourse,
    };
  }

  async updateOne(id: string, body: UpdateCourseDto): Promise<ResponseObject> {
    const course = await this.courseModel.findById(id).exec();

    if (!course) throw new NotFoundException('Course not found');

    // Check if there are any changes
    const hasChanges = Object.keys(body).some(key => body[key] !== course[key]);
    if (!hasChanges) throw new NotFoundException('No changes found');

    const updatedCourse = await this.courseModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Course updated successfully',
      course: updatedCourse,
    };
  }

  async deleteOne(id: string): Promise<ResponseObject> {
    const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();

    if (!deletedCourse) throw new NotFoundException('Course not found');

    return {
      statusCode: HttpStatus.OK,
      message: 'Course deleted successfully',
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
}
