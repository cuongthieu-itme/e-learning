import { LectureStatus } from '@/types';
import { sanitizeInput } from '@/common/utils';
import { Transform } from 'class-transformer';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateLectureDto {
  @IsMongoId()
  @IsOptional()
  courseId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  outline?: string;

  @IsUrl()
  @IsOptional()
  pptxUrl?: string;

  @IsUrl()
  @IsOptional()
  mindmapUrl?: string;

  @IsEnum(LectureStatus)
  @IsOptional()
  status?: LectureStatus;
}
