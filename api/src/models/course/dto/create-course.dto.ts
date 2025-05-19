import { sanitizeInput } from '@/common/utils';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @Length(2, 100)
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeInput(value))
  name: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  description?: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeInput(value))
  subject: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
