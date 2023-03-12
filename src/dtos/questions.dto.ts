import { Option } from "@prisma/client";
import { IsBoolean, IsInt, IsObject, IsOptional, IsString } from "class-validator";

export class CreateQuestionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  questionGPT: string;

  @IsBoolean()
  @IsOptional()
  status: Boolean;

  @IsInt()
  categoryId: number;

  @IsObject({ each: true })
  options: Omit<Option, "id">[];
}
