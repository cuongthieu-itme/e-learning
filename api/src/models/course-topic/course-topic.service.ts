import { HttpStatus, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery, UpdateWriteOpResult, Types } from 'mongoose';

import { CourseTopic } from './schema/course-topic.schema';

import { CreateCourseTopicDto } from './dto/create-course-topic.dto';
import { UpdateCourseTopicDto } from './dto/update-course-topic.dto';
import { GetCourseTopicsDto } from './dto/get-course-topics.dto';
import { ResponseObject } from '@/types';

@Injectable()
export class CourseTopicService {
  constructor(
    @InjectModel(CourseTopic.name) private readonly courseTopicModel: Model<CourseTopic>,
  ) {}

  async find(query: FilterQuery<CourseTopic> = {}, select?: string): Promise<CourseTopic[]> {
    return await this.courseTopicModel.find(query).select(select).lean().exec();
  }

  async countDocuments(
    query: FilterQuery<CourseTopic> = {},
    select?: string,
  ): Promise<number> {
    return await this.courseTopicModel.countDocuments(query).select(select).exec();
  }

  async findAndUpdateMany(
    query: FilterQuery<CourseTopic> = {},
    update: UpdateQuery<CourseTopic> = {},
  ): Promise<UpdateWriteOpResult> {
    return await this.courseTopicModel.updateMany(query, update).exec();
  }

  async findById(id: string): Promise<CourseTopic> {
    return this.courseTopicModel.findById(id).lean().exec();
  }

  async createOne(body: CreateCourseTopicDto): Promise<ResponseObject> {
    try {
      // Check if the topic already exists for this course
      const existingTopic = await this.courseTopicModel.findOne({
        courseId: new Types.ObjectId(body.courseId),
        topic: body.topic
      }).lean().exec();

      if (existingTopic) {
        throw new ConflictException('Topic already exists for this course');
      }

      const newCourseTopic = await this.courseTopicModel.create({
        ...body,
        courseId: new Types.ObjectId(body.courseId),
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Course topic created successfully',
        courseTopic: newCourseTopic,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      
      if (error.code === 11000) {
        throw new ConflictException('Topic already exists for this course');
      }
      
      throw error;
    }
  }

  async updateOne(id: string, body: UpdateCourseTopicDto): Promise<ResponseObject> {
    const courseTopic = await this.courseTopicModel.findById(id).exec();

    if (!courseTopic) throw new NotFoundException('Course topic not found');

    try {
      // Check if the updated topic would create a duplicate
      if (body.topic || body.courseId) {
        const courseIdToCheck = body.courseId 
          ? new Types.ObjectId(body.courseId) 
          : courseTopic.courseId;
        
        const topicToCheck = body.topic || courseTopic.topic;
        
        const existingTopic = await this.courseTopicModel.findOne({
          _id: { $ne: new Types.ObjectId(id) },
          courseId: courseIdToCheck,
          topic: topicToCheck
        }).lean().exec();

        if (existingTopic) {
          throw new ConflictException('Topic already exists for this course');
        }
      }

      // Check if there are any changes
      const hasChanges = Object.keys(body).some(key => body[key] !== courseTopic[key]);
      if (!hasChanges) throw new NotFoundException('No changes found');

      const updateData: any = {};
      if (body.topic) updateData.topic = body.topic;
      if (body.courseId) updateData.courseId = new Types.ObjectId(body.courseId);

      const updatedCourseTopic = await this.courseTopicModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true },
      ).exec();

      return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Course topic updated successfully',
        courseTopic: updatedCourseTopic,
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      
      if (error.code === 11000) {
        throw new ConflictException('Topic already exists for this course');
      }
      
      throw error;
    }
  }

  async deleteOne(id: string): Promise<ResponseObject> {
    const deletedCourseTopic = await this.courseTopicModel.findByIdAndDelete(id).exec();

    if (!deletedCourseTopic) throw new NotFoundException('Course topic not found');

    return {
      statusCode: HttpStatus.OK,
      message: 'Course topic deleted successfully',
    };
  }

  async getOne(id: string): Promise<ResponseObject> {
    const courseTopic = await this.courseTopicModel.findById(id)
      .populate('courseId', 'name subject')
      .lean()
      .exec();

    if (!courseTopic) throw new NotFoundException('Course topic not found');

    return {
      statusCode: HttpStatus.OK,
      courseTopic,
    };
  }

  async getAll({
    page = 1,
    limit = 10,
    search,
    sort,
    courseId,
  }: GetCourseTopicsDto): Promise<ResponseObject> {
    const conditions: any = {};

    if (search) {
      const regexSearch = new RegExp(String(search), 'i');
      conditions.topic = { $regex: regexSearch };
    }

    if (courseId) {
      conditions.courseId = new Types.ObjectId(courseId);
    }

    const sortOptions: any = { 
      topic: sort === 'desc' ? -1 : 1 
    };

    const courseTopics = await this.courseTopicModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('courseId', 'name subject')
      .lean()
      .exec();

    const totalTopics = await this.courseTopicModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      courseTopics,
      totalTopics,
      currentPage: page,
      totalPages: Math.ceil(totalTopics / limit),
    };
  }

  async getCourseTopics(courseId: string): Promise<ResponseObject> {
    const conditions = { courseId: new Types.ObjectId(courseId) };

    const courseTopics = await this.courseTopicModel
      .find(conditions)
      .sort({ topic: 1 })
      .lean()
      .exec();

    return {
      statusCode: HttpStatus.OK,
      courseTopics,
      totalTopics: courseTopics.length,
    };
  }
}
