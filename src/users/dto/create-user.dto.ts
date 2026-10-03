import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

// Lista de roles permitidos desde la API.
// Puedes agregar más roles aquí, pero también debes agregarlos en el enum Role de Prisma.
export const USER_ROLES = ['ADMIN', 'USER', 'SUPERVISOR'] as const;
export type UserRoleDto = (typeof USER_ROLES)[number];

// DTO usado para crear usuarios desde el endpoint POST /users.
export class CreateUserDto {
  // class-validator revisa que el valor tenga formato de correo.
  @IsEmail()
  email!: string;

  // Nombre obligatorio con mínimo de caracteres.
  @IsString()
  @MinLength(2)
  name!: string;

  // Password plano recibido desde el cliente.
  // Más adelante el service lo convertirá en passwordHash.
  @IsString()
  @MinLength(8)
  password!: string;

  // El rol es opcional. Si no se envía, Prisma usará USER por defecto.
  @IsOptional()
  @IsIn(USER_ROLES)
  role?: UserRoleDto;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  birthdate?: string;

  @IsOptional()
  @IsString()
  foto?: string;
}