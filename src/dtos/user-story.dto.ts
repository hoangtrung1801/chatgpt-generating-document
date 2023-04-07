import UserStoryStatusEnum from "@/utils/enums/user-story-status";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserStoryDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(UserStoryStatusEnum)
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  storyPoint?: number;

  @IsNumber()
  @IsOptional()
  assigneeId?: number;

  @IsNumber()
  @IsOptional()
  sprintId?: number;

  @IsNumber()
  @IsOptional()
  epicId?: number;

  @IsNumber()
  selectionId: number;
}
