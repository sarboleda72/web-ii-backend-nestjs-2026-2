import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HerramientasModule } from './herramientas/herramientas.module';
import { PrestamosModule } from './prestamos/prestamos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envValidationSchema,
    }),
    // Registramos el módulo de usuarios dentro de la aplicación principal.
    UsersModule,
    AuthModule,
    HerramientasModule,
    PrestamosModule,
  ],
})
export class AppModule {}