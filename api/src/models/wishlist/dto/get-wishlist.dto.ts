import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class GetWishlistDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => (value ? Number(value) : 1))
  readonly page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => (value ? Number(value) : 10))
  readonly limit: number = 10;
}
