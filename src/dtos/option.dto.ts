import { Prisma } from "@prisma/client";
import { IsString } from "class-validator";

export class CreateOptionDto implements Prisma.OptionUpdateInput {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  type: string;

  // question: QuestionUpdateOneRequiredWithoutOptionsNestedInput
  // selectedOptions?: SelectedOptionUpdateManyWithoutOptionNestedInput
}
