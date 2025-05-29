import { IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class GenerateAiQuestionsDto {
  @IsMongoId()
  @IsNotEmpty()
  lectureId: string;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  count: number = 5;

  @IsString()
  @IsOptional()
  lecture: string;
}
