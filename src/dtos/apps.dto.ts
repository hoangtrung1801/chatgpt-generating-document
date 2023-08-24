import { AppStatus } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

export class CreateAppDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsEnum(AppStatus)
  @IsOptional()
  status: AppStatus;

  @IsInt()
  categoryId: number;
}
