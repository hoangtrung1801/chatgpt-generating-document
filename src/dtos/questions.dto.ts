import { QuestionType } from "@prisma/client";
import { IsBoolean, IsEnum, IsInt, IsObject, IsOptional, IsString } from "class-validator";
import { CreateOptionDto } from "./option.dto";

export class CreateQuestionDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  questionGPT: string;

  @IsString()
  @IsOptional()
  keyword: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsInt()
  appId: number;

  @IsObject({ each: true })
  options: CreateOptionDto;
}
