import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CourseTopic, CourseTopicSchema } from './schema/course-topic.schema';
import { CourseTopicService } from './course-topic.service';
import { CourseTopicController } from './course-topic.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CourseTopic.name, schema: CourseTopicSchema }]),
  ],
  controllers: [CourseTopicController],
  providers: [CourseTopicService],
  exports: [CourseTopicService],
})
export class CourseTopicModule {}
