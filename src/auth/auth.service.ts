import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { UsersService } from '../users/users.service';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import type { AuthenticatedUser } from './types/authenticated-user.type';

@Injectable()
export class AuthService {
  constructor(
    // Reutilizamos UsersService para crear usuarios y validar credenciales.
    private readonly usersService: UsersService,

    // AuthRepository maneja persistencia de refresh tokens.
    private readonly authRepository: AuthRepository,

    // JwtService firma y verifica tokens.
    private readonly jwtService: JwtService,

    // ConfigService lee secretos y tiempos desde .env.
    private readonly config: ConfigService,
  ) {}

  // Registro: crea usuario y devuelve tokens de una vez.
  async register(dto: RegisterDto) {
    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });

    return this.login({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  // Validación usada por LocalStrategy durante login.
  // Retorna null si las credenciales no son válidas.
  async validateUser(email: string, password: string): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user || !user.isActive) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  // Login: emite access token corto y refresh token más largo.
  async login(user: AuthenticatedUser) {
    // jti identifica este refresh token en base de datos.
    const refreshTokenId = randomUUID();
    const accessTokenExpiresIn =
      this.config.getOrThrow<JwtSignOptions['expiresIn']>('JWT_ACCESS_EXPIRES_IN');
    const refreshTokenExpiresIn =
      this.config.getOrThrow<JwtSignOptions['expiresIn']>('JWT_REFRESH_EXPIRES_IN');

    const accessToken = await this.jwtService.signAsync(
      {
        // sub guarda el id del usuario según convención JWT.
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: accessTokenExpiresIn,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        // jti permite revocar este refresh token específico.
        jti: refreshTokenId,
      },
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshTokenExpiresIn,
      },
    );

    // Guardamos hash del refresh token para que si la DB se filtra no exponga tokens usables.
    const tokenHash = await bcrypt.hash(
      refreshToken,
      this.config.getOrThrow<number>('BCRYPT_SALT_ROUNDS'),
    );

    await this.authRepository.createRefreshToken({
      id: refreshTokenId,
      userId: user.id,
      tokenHash,
      expiresAt: this.calculateRefreshExpiration(),
    });

    // Respuesta estándar para que el cliente use accessToken como Bearer token.
    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
    };
  }

  // Refresh: valida refreshToken, lo revoca y entrega un par nuevo.
  // Esta rotación reduce el daño si un refresh token viejo se filtra.
  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string; jti: string }>(
        refreshToken,
        {
          secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );

      const storedToken = await this.authRepository.findRefreshTokenById(payload.jti);

      // Validaciones mínimas: existe, no está revocado, no expiró y pertenece al usuario correcto.
      if (
        !storedToken ||
        storedToken.revokedAt ||
        storedToken.expiresAt <= new Date() ||
        storedToken.userId !== payload.sub
      ) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Compara el token recibido contra el hash guardado.
      const matches = await bcrypt.compare(refreshToken, storedToken.tokenHash);

      if (!matches) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Rotación: el refresh token anterior deja de servir.
      await this.authRepository.revokeRefreshToken(storedToken.id);

      return this.login({
        id: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role,
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  // Logout: revoca todos los refresh tokens activos del usuario.
  logout(user: AuthenticatedUser) {
    return this.authRepository.revokeActiveTokensByUser(user.id);
  }

  // Convierte valores como 15m, 2h o 7d en una fecha de expiración.
  private calculateRefreshExpiration() {
    const expiresIn = this.config.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN');
    const match = /^(\d+)([mhd])$/.exec(expiresIn);

    if (!match) {
      // Valor por defecto si la variable no cumple el formato esperado.
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const value = Number(match[1]);
    const unit = match[2];
    const multiplier =
      unit === 'm'
        ? 60 * 1000
        : unit === 'h'
          ? 60 * 60 * 1000
          : 24 * 60 * 60 * 1000;

    return new Date(Date.now() + value * multiplier);
  }
}