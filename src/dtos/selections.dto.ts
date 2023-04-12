import { ArrayMinSize, IsArray, IsInt, IsJSON, IsObject, IsString } from "class-validator";

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
