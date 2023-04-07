import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSprintDto {
  @IsString()
  name: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsNumber()
  selectionId: number;

  @IsNumber({ allowNaN: false }, { each: true })
  @IsOptional()
  userStoryIds: number[];
}
