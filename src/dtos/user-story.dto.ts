import UserStoryStatusEnum from "@/utils/enums/user-story-status";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateStoryDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(UserStoryStatusEnum)
  @IsOptional()
  status?: string;
}
