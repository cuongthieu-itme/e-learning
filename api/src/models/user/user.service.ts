import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  async find(query: FilterQuery<User> = {}, select?: string): Promise<User[]> {
    return await this.userModel.find(query).select(select).lean().exec();
  }

  async countDocuments(
    query: FilterQuery<User> = {},
    select?: string,
  ): Promise<number> {
    return await this.userModel.countDocuments(query).select(select).exec();
  }

  async findAndUpdateMany(
    query: FilterQuery<User> = {},
    update: UpdateQuery<User> = {},
  ): Promise<UpdateWriteOpResult> {
    return await this.userModel.updateMany(query, update).exec();
  }

  async findOneByIdAndUpdate(
    id: string,
    update: UpdateQuery<User> = {},
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, update).exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).lean().exec();
  }

  async findOneByEmail(email: string, select?: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).select(select);
  }

  async createOne(body: Record<string, any>): Promise<User> {
    return await this.userModel.create(body);
  }

  async updateOne(id: string, body: UpdateProfileDto): Promise<ResponseObject> {
    const user = await this.userModel.findById(id).exec();

    if (
      body.first_name === user.first_name &&
      body.last_name === user.last_name &&
      body.email === user.email &&
      body.role === user.role
    )
      throw new NotFoundException('Giá trị chưa thay đổi');

    const updatedProfile = await this.userModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!updatedProfile) throw new NotFoundException('User not found');

    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Cập nhật người dùng thành công',
    };
  }

  async getOne(id: string): Promise<ResponseObject> {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('User not found');

    return {
      statusCode: HttpStatus.OK,
      user,
    };
  }

  async getAll({
    page = 1,
    limit = 10,
    search,
    sort,
    role,
  }: GetUsersDto): Promise<ResponseObject> {
    const conditions: any = {};

    if (search) {
      const regexSearch = new RegExp(String(search), 'i');
      conditions.$or = [
        { first_name: { $regex: regexSearch } },
        { last_name: { $regex: regexSearch } },
        { email: { $regex: regexSearch } },
      ];
    }

    if (role) {
      conditions.role = role;
    }

    const sortOptions: any = { createdAt: sort === 'desc' ? -1 : 1 };

    const users = await this.userModel
      .find(conditions)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password')
      .lean()
      .exec();

    const totalUsers = await this.userModel.countDocuments(conditions);

    return {
      statusCode: HttpStatus.OK,
      users,
      totalUsers,
    };
  }
}
