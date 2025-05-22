import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery, UpdateWriteOpResult } from 'mongoose';

import { Lecture } from './schema/lecture.schema';

import { LectureStatus, ResponseObject } from '@/types';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { GetLecturesDto } from './dto/get-lectures.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectModel(Lecture.name) private readonly lectureModel: Model<Lecture>,
  ) { }

  async find(query: FilterQuery<Lecture> = {}, select?: string): Promise<Lecture[]> {
    return await this.lectureModel.find(query).select(select).lean().exec();
  }

  async countDocuments(
    query: FilterQuery<Lecture> = {},
    select?: string,
  ): Promise<number> {
    return await this.lectureModel.countDocuments(query).select(select).exec();
  }

  async findAndUpdateMany(
    query: FilterQuery<Lecture> = {},
    update: UpdateQuery<Lecture> = {},
  ): Promise<UpdateWriteOpResult> {
    return await this.lectureModel.updateMany(query, update).exec();
  }

  async findById(id: string): Promise<Lecture> {
    return this.lectureModel.findById(id).lean().exec();
  }

  async createOne(body: CreateLectureDto, userId: string): Promise<ResponseObject> {
    const newLecture = await this.lectureModel.create({
      ...body,
      courseId: new Types.ObjectId(body.courseId),
      createdById: new Types.ObjectId(userId),
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Lecture created successfully',
      lecture: newLecture,
    };
  }

  async updateOne(id: string, body: UpdateLectureDto, userId: string): Promise<ResponseObject> {
    const lecture = await this.lectureModel.findById(id).exec();

    if (!lecture) throw new NotFoundException('Lecture not found');

    // Check if user is authorized to update this lecture
    if (lecture.createdById.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to update this lecture');
    }

    // Only allow published status to be updated if content and outline exist
    if (body.status === LectureStatus.PUBLISHED) {
      if (!lecture.content || !lecture.outline) {
        throw new ForbiddenException('Cannot publish lecture without content and outline');
      }
    }

    // Check if there are any changes
    const hasChanges = Object.keys(body).some(key => body[key] !== lecture[key]);
    if (!hasChanges) throw new NotFoundException('No changes found');

    const updateData: any = { ...body };
    if (body.courseId) updateData.courseId = new Types.ObjectId(body.courseId);

    const updatedLecture = await this.lectureModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).exec();

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Lecture updated successfully',
      lecture: updatedLecture,
    };
  }

  async deleteOne(id: string, userId: string): Promise<ResponseObject> {
    const lecture = await this.lectureModel.findById(id).exec();

    if (!lecture) throw new NotFoundException('Lecture not found');

    // Check if user is authorized to delete this lecture
    if (lecture.createdById.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to delete this lecture');
    }

    await this.lectureModel.findByIdAndDelete(id).exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'Lecture deleted successfully',
    };
  }

  async getOne(id: string): Promise<ResponseObject> {
    const lecture = await this.lectureModel.findById(id)
      .populate('courseId', 'name subject')
      .populate('createdById', 'first_name last_name')
      .lean()
      .exec();

    if (!lecture) throw new NotFoundException('Lecture not found');

    return {
      statusCode: HttpStatus.OK,
      lecture,
    };
  }

  async getAll({
    page = 1,
    limit = 10,
    search,
    sort,
    courseId,
    createdById,
    status,
  }: GetLecturesDto): Promise<ResponseObject> {
    const conditions: any = {};

    if (search) {
      const regexSearch = new RegExp(String(search), 'i');
      conditions.$or = [
        { title: { $regex: regexSearch } },
        { content: { $regex: regexSearch } },
        { outline: { $regex: regexSearch } },
      ];
    }

    if (courseId) {
      conditions.courseId = new Types.ObjectId(courseId);
    }

    if (createdById) {
      conditions.createdById = new Types.ObjectId(createdById);
    }

    if (status) {
      conditions.status = status;
    }

    const sortOptions: any = {
      createdAt: sort === 'desc' ? -1 : 1
    };

    const lectures = await this.lectureModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('courseId', 'name subject')
      .populate('createdById', 'first_name last_name')
      .lean()
      .exec();

    const totalLectures = await this.lectureModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      lectures,
      totalLectures,
      currentPage: page,
      totalPages: Math.ceil(totalLectures / limit),
    };
  }

  async getUserLectures(userId: string, {
    page = 1,
    limit = 10,
    search,
    sort,
    courseId,
    status,
  }: GetLecturesDto): Promise<ResponseObject> {
    const conditions: any = { createdById: new Types.ObjectId(userId) };

    if (search) {
      const regexSearch = new RegExp(String(search), 'i');
      conditions.$or = [
        { title: { $regex: regexSearch } },
        { content: { $regex: regexSearch } },
        { outline: { $regex: regexSearch } },
      ];
    }

    if (courseId) {
      conditions.courseId = new Types.ObjectId(courseId);
    }

    if (status) {
      conditions.status = status;
    }

    const sortOptions: any = {
      createdAt: sort === 'desc' ? -1 : 1
    };

    const lectures = await this.lectureModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('courseId', 'name subject')
      .lean()
      .exec();

    const totalLectures = await this.lectureModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      lectures,
      totalLectures,
      currentPage: page,
      totalPages: Math.ceil(totalLectures / limit),
    };
  }

  async getCourseLectures(courseId: string, {
    page = 1,
    limit = 10,
    search,
    sort,
    status,
  }: GetLecturesDto): Promise<ResponseObject> {
    const conditions: any = {
      courseId: new Types.ObjectId(courseId),
      status: LectureStatus.PUBLISHED, // Only return published lectures by default
    };

    if (search) {
      const regexSearch = new RegExp(String(search), 'i');
      conditions.$or = [
        { title: { $regex: regexSearch } },
        { content: { $regex: regexSearch } },
        { outline: { $regex: regexSearch } },
      ];
    }

    // Override the status if explicitly specified
    if (status) {
      conditions.status = status;
    }

    const sortOptions: any = {
      createdAt: sort === 'desc' ? -1 : 1
    };

    const lectures = await this.lectureModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdById', 'first_name last_name')
      .lean()
      .exec();

    const totalLectures = await this.lectureModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      lectures,
      totalLectures,
      currentPage: page,
      totalPages: Math.ceil(totalLectures / limit),
    };
  }

  async publishLecture(id: string, userId: string): Promise<ResponseObject> {
    const lecture = await this.lectureModel.findById(id).exec();

    if (!lecture) throw new NotFoundException('Lecture not found');

    // Check if user is authorized to publish this lecture
    if (lecture.createdById.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to publish this lecture');
    }

    // Check if lecture has content and outline
    if (!lecture.content || !lecture.outline) {
      throw new ForbiddenException('Cannot publish lecture without content and outline');
    }

    const updatedLecture = await this.lectureModel.findByIdAndUpdate(
      id,
      { $set: { status: LectureStatus.PUBLISHED } },
      { new: true }
    ).exec();

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Lecture published successfully',
      lecture: updatedLecture,
    };
  }

  async unpublishLecture(id: string, userId: string): Promise<ResponseObject> {
    const lecture = await this.lectureModel.findById(id).exec();

    if (!lecture) throw new NotFoundException('Lecture not found');

    // Check if user is authorized to unpublish this lecture
    if (lecture.createdById.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to unpublish this lecture');
    }

    const updatedLecture = await this.lectureModel.findByIdAndUpdate(
      id,
      { $set: { status: LectureStatus.DRAFT } },
      { new: true }
    ).exec();

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Lecture unpublished successfully',
      lecture: updatedLecture,
    };
  }

  async getPublicCourseLectures(courseId: string, {
    page = 1,
    limit = 10,
    search,
    sort,
    status,
    createdById,
  }: GetLecturesDto): Promise<ResponseObject> {
    const conditions: any = {
      courseId: new Types.ObjectId(courseId),
    };

    if (!status) {
      conditions.status = LectureStatus.PUBLISHED;
    } else {
      conditions.status = status;
    }

    if (search) {
      const regexSearch = new RegExp(String(search), 'i');
      conditions.$or = [
        { title: { $regex: regexSearch } },
        { content: { $regex: regexSearch } },
        { outline: { $regex: regexSearch } },
      ];
    }

    if (createdById) {
      conditions.createdById = new Types.ObjectId(createdById);
    }

    const sortOptions: any = {};

    if (sort === 'title_asc') {
      sortOptions.title = 1;
    } else if (sort === 'title_desc') {
      sortOptions.title = -1;
    } else if (sort === 'asc') {
      sortOptions.createdAt = 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const lectures = await this.lectureModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdById', 'first_name last_name')
      .populate('courseId', 'name subject')
      .lean()
      .exec();

    const totalLectures = await this.lectureModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      lectures,
      totalLectures,
      currentPage: page,
      totalPages: Math.ceil(totalLectures / limit),
    };
  }
}
