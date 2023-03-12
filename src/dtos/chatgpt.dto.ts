import { IsInt } from "class-validator";

export class GenerateBriefAnswerDto {
  @IsInt()
  selectionId: number;
}
