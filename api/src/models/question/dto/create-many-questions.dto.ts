import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateQuestionDto } from './create-question.dto';

export class CreateManyQuestionsDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one question is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
