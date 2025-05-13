import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User } from '@/models/user/schema/user.schema';
import { Role } from '@/types';

@Injectable()
export class AdminSeeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async seed(): Promise<void> {
    const adminExists = await this.userModel.findOne({ role: Role.Admin });

    if (adminExists) {
      console.log('Admin account already exists');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new this.userModel({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@elearning.com',
      password: hashedPassword,
      role: Role.Admin,
    });

    await admin.save();
    console.log('Admin account created successfully');
  }
}
