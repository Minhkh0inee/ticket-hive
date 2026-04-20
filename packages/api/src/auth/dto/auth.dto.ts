import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string
}


export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string
}