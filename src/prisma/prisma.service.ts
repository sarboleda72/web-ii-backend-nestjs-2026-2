import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      // Adapter oficial para conectar Prisma con PostgreSQL.
      adapter: new PrismaPg({
        // Puedes cambiar DATABASE_URL en .env sin tocar este archivo.
        connectionString: config.getOrThrow<string>('DATABASE_URL'),
      }),

      // En desarrollo mostramos queries para aprender y depurar.
      // En producción evitamos tanto ruido y dejamos advertencias/errores.
      log:
        config.get<string>('NODE_ENV') === 'development'
          ? ['query', 'warn', 'error']
          : ['warn', 'error'],
    });
  }

  // NestJS llama este método cuando el módulo se inicializa.
  async onModuleInit() {
    await this.$connect();
  }

  // NestJS llama este método al apagar la aplicación.
  async onModuleDestroy() {
    await this.$disconnect();
  }
}