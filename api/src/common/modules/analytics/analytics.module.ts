import { CourseModule } from '@/models/course/course.module';
import { CourseTopicModule } from '@/models/course-topic/course-topic.module';
import { LectureModule } from '@/models/lecture/lecture.module';
import { QuestionModule } from '@/models/question/question.module';
import { UserModule } from '@/models/user/user.module';
import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
    imports: [
        UserModule,
        CourseModule,
        LectureModule,
        QuestionModule,
        CourseTopicModule
    ],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    exports: [AnalyticsService],
})
export class AnalyticsModule { }
