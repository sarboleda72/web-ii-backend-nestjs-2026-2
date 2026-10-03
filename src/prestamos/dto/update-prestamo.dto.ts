import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdatePrestamoDto {
  @IsOptional()
  @IsString()
  usuarioId?: string;

  @IsOptional()
  @IsString()
  herramientaId?: string;

  @IsOptional()
  @IsDateString()
  fechaPrestamo?: string;

  @IsOptional()
  @IsDateString()
  fechaDevolucion?: string;

  @IsOptional()
  @IsIn(['ACTIVO', 'DEVUELTO'])
  estado?: 'ACTIVO' | 'DEVUELTO';
}
