import { sanitizeInput } from '@/common/utils';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCourseTopicDto {
  @IsMongoId()
  @IsOptional()
  courseId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  topic?: string;
}
