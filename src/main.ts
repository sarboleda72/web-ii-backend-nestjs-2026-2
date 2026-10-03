import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Función principal de arranque de NestJS.
// Aquí configuramos todo lo que debe aplicar a la API completa.
async function bootstrap() {
  // Crea la aplicación tomando AppModule como punto de entrada.
  const app = await NestFactory.create(AppModule);

  // Obtiene ConfigService para leer variables ya validadas desde .env.
  const config = app.get(ConfigService);

  // Para la clase permitimos peticiones desde cualquier origen.
  app.enableCors({
    origin: '*',
  });

  // Todas las rutas comenzarán con /api/v1. Puedes cambiarlo a /api o /v1 si prefieres.
  app.setGlobalPrefix('api/v1');

  // Este pipe hace que los DTOs realmente validen lo que llega por HTTP.
  app.useGlobalPipes(
    new ValidationPipe({
      // Elimina campos que no estén definidos en el DTO.
      whitelist: true,

      // En lugar de ignorar campos extra, lanza error si el cliente envía algo no permitido.
      forbidNonWhitelisted: true,

      // Permite transformar datos cuando NestJS pueda hacerlo de forma segura.
      transform: true,
    }),
  );

  // Lee PORT desde variables de entorno. getOrThrow falla rápido si no existe.
  const port = config.getOrThrow<number>('PORT');
  await app.listen(port);
}

bootstrap();