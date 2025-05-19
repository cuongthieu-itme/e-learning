import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Lecture, LectureSchema } from './schema/lecture.schema';
import { LectureService } from './lecture.service';
import { LectureController } from './lecture.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lecture.name, schema: LectureSchema }]),
  ],
  controllers: [LectureController],
  providers: [LectureService],
  exports: [LectureService],
})
export class LectureModule {}
