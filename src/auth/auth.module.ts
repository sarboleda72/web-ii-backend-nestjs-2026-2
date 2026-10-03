import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  // Importamos UsersModule porque AuthService usa UsersService.
  // JwtModule.register({}) se deja vacío porque los secretos se pasan al firmar/verificar.
  imports: [UsersModule, PrismaModule, PassportModule, JwtModule.register({})],

  // Endpoints de autenticación.
  controllers: [AuthController],

  // Strategies, services y guards que pertenecen a autenticación.
  providers: [
    AuthService,
    AuthRepository,
    LocalStrategy,
    JwtStrategy,
    {
      // APP_GUARD hace que JwtAuthGuard sea global.
      // Así todos los endpoints quedan protegidos salvo los que tengan @Public().
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}