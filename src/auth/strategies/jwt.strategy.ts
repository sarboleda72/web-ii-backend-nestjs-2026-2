import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// PassportStrategy adapta passport-jwt al estilo de NestJS.
import { PassportStrategy } from '@nestjs/passport';

// ExtractJwt sabe extraer el token desde headers HTTP.
// Strategy es la estrategia JWT real de Passport.
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AuthenticatedUser } from '../types/authenticated-user.type';

type JwtPayload = {
  // sub normalmente representa el id del usuario dentro de un JWT.
  sub: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'SUPERVISOR';
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      // Extrae el token desde el header Authorization: Bearer TOKEN.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // false significa que Passport rechazará tokens vencidos.
      ignoreExpiration: false,

      // Debe ser el mismo secreto usado al crear accessToken.
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  // Lo que retorna validate queda disponible como request.user.
  // Importante: aquí no consultamos la base de datos.
  // Confiamos en el payload porque el token ya fue verificado con JWT_ACCESS_SECRET.
  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}