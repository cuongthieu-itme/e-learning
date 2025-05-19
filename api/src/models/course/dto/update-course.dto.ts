import { sanitizeInput } from '@/common/utils';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  name?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  description?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  subject?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
