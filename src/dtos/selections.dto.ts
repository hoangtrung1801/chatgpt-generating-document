import {} from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateSelectionDto {
  @IsInt({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  selectedOptions: number[];

  @IsInt()
  appId: number;

  @IsString()
  projectName: string;

  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsUUID()
  @IsOptional()
  guestId: string;
}

export class SelectionDto extends CreateSelectionDto {
  @IsString()
  @IsOptional()
  document: string;
}

export class UserFlowDto {
  // @IsObject({ each: true })
  // nodes: object[];

  // @IsObject({ each: true })
  // edges: object[];

  @IsString()
  userFlow: string;
}

// class UserFlowNode {
//   id: number | string;

//   position: { x: number; y: number };
// }
