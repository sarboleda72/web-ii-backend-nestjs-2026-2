import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [
    // ConfigModule carga el archivo .env y valida sus valores al iniciar la aplicación.
    ConfigModule.forRoot({
      // isGlobal permite usar ConfigService en cualquier módulo sin volver a importar ConfigModule.
      isGlobal: true,

      // cache evita releer las variables muchas veces durante la ejecución.
      cache: true,

      // Si falta una variable obligatoria o tiene formato inválido, NestJS no arranca.
      validationSchema: envValidationSchema,
    }),
  ],
})
export class AppModule {}