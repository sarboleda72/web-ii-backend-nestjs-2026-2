import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePrestamoDto {
  @IsString()
  @MinLength(1)
  usuarioId!: string;

  @IsString()
  @MinLength(1)
  herramientaId!: string;

  @IsOptional()
  @IsDateString()
  fechaPrestamo?: string;
}
