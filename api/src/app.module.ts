import { AuthModule } from '@/authentication/auth.module';
import { CourseTopicModule } from '@/models/course-topic/course-topic.module';
import { CourseModule } from '@/models/course/course.module';
import { LectureModule } from '@/models/lecture/lecture.module';
import { QuestionModule } from '@/models/question/question.module';
import { UserModule } from '@/models/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AnalyticsModule } from './common/modules/analytics/analytics.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 25,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_URL'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
      }),
    }),
    AuthModule,
    UserModule,
    CourseModule,
    CourseTopicModule,
    LectureModule,
    QuestionModule,
    AnalyticsModule
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
