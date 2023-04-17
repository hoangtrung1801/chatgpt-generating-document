import { IsEmail, IsOptional, IsString, IsUUID } from "class-validator";
import { CreateUserDto } from "./users.dto";

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class SignUpDto extends CreateUserDto {
  @IsUUID()
  @IsOptional()
  guestId: string;
}
