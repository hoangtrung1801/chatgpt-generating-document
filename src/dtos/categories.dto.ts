import { CategoryStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsEnum(CategoryStatus)
  @IsOptional()
  status: CategoryStatus;
}
