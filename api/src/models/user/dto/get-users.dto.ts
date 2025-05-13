import { sanitizeInput } from '@/common/utils';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class GetUsersDto {
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
  @IsEnum(['admin', 'teacher', 'user'])
  readonly role?: 'admin' | 'teacher' | 'user';
}
