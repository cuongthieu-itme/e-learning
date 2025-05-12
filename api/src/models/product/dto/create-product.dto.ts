import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';
import { sanitizeInput } from '@/common/utils';
import { AttributesValidator } from '@/common/validators/attributes.validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(25)
  @Transform(({ value }) => sanitizeInput(value))
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100000)
  @Transform(({ value }) => Number(value))
  price: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  @Transform(({ value }) => sanitizeInput(value))
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1000)
  @Transform(({ value }) => Number(value))
  stock: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  discount?: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  category: number;

  @IsObject()
  @IsNotEmpty()
  @Transform(({ value }) => JSON.parse(value))
  @Validate(AttributesValidator)
  attributes: Record<string, any>;
}
