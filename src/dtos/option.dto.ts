import { IsOptional, IsString } from "class-validator";

export class CreateOptionDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  type: string;

  // question: QuestionUpdateOneRequiredWithoutOptionsNestedInput
  // selectedOptions?: SelectedOptionUpdateManyWithoutOptionNestedInput
}
