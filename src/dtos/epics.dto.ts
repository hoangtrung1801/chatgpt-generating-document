import { EpicStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEpicDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  selectionId: number;

  @IsEnum(EpicStatus)
  @IsOptional()
  status: EpicStatus;

  @IsNumber({ allowNaN: false }, { each: true })
  @IsOptional()
  userStoryIds: number[];
}
