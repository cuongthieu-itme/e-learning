import { sanitizeInput } from '@/common/utils';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Role } from '@/types';

export class UpdateProfileDto {
  @IsString()
  @Length(2, 15)
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  first_name?: string;

  @IsString()
  @Length(2, 15)
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => sanitizeInput(value))
  last_name?: string;
  
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
  
  @IsString()
  @IsOptional()
  email?: string;
}
