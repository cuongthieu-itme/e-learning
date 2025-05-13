import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '@/models/user/schema/user.schema';
import { AdminSeeder } from './admin.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AdminSeeder],
  exports: [AdminSeeder],
})
export class SeederModule {}
