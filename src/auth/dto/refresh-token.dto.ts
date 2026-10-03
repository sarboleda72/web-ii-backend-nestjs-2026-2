import { IsString } from 'class-validator';

// DTO para pedir nuevos tokens usando un refresh token vigente.
export class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}