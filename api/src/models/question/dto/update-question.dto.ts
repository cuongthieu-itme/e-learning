import { sanitizeInput } from '@/common/utils';
import { Transform } from 'class-transformer';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateQuestionDto {
  @IsMongoId()
  @IsOptional()
  lectureId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  question?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  optionA?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  optionB?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  optionC?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  optionD?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEnum(['A', 'B', 'C', 'D'])
  @Matches(/^[A-D]$/, { message: 'correctAnswer must be A, B, C or D' })
  correctAnswer?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  explanation?: string;
}
