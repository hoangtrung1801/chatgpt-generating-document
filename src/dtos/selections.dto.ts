import { ArrayMinSize, IsArray, IsInt, IsString } from "class-validator";

export class CreateSelectionDto {
  @IsInt({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  selectedOptions: number[];

  @IsInt()
  categoryId: number;

  @IsString()
  title: string;

  @IsString()
  description: string;
}
