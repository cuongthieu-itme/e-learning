import { LectureStatus } from '@/types';
import { sanitizeInput } from '@/common/utils';
import { Transform } from 'class-transformer';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateLectureDto {
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeInput(value))
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  outline: string;

  @IsUrl()
  @IsOptional()
  pptxUrl?: string;

  @IsUrl()
  @IsOptional()
  mindmapUrl?: string;

  @IsEnum(LectureStatus)
  @IsOptional()
  status?: LectureStatus = LectureStatus.DRAFT;
}
