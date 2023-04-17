import { ArrayMinSize, IsArray, IsInt, IsObject, IsOptional, IsString } from "class-validator";

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
}

export class UserFlowDto {
  @IsObject({ each: true })
  nodes: object[];

  @IsObject({ each: true })
  edges: object[];
}

// class UserFlowNode {
//   id: number | string;

//   position: { x: number; y: number };
// }
