import { LectureStatus } from '@/types';
import { sanitizeInput } from '@/common/utils';
import { Transform } from 'class-transformer';
import { IsEnum, IsMongoId, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class GetLecturesDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => (value ? Number(value) : 1))
  readonly page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => (value ? Number(value) : 10))
  readonly limit?: number = 10;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => sanitizeInput(value))
  readonly search?: string;

  @IsOptional()
  @IsString()
  readonly sort?: string;

  @IsOptional()
  @IsMongoId()
  readonly courseId?: string;
  
  @IsOptional()
  @IsMongoId()
  readonly createdById?: string;
  
  @IsOptional()
  @IsEnum(LectureStatus)
  readonly status?: LectureStatus;
}
