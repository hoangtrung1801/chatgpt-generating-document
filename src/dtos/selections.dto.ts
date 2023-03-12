import { ArrayMinSize, IsArray, IsInt } from "class-validator";

export class CreateSelectionDto {
  @IsInt({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  selectedOptions: number[];
}
