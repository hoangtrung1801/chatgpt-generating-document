import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class CreateAppDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsInt()
  categoryId: number;
}
