import { IsEmail, IsString, MinLength } from 'class-validator';

// DTO para POST /auth/login.
// LocalStrategy usará estos campos para validar credenciales.
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}