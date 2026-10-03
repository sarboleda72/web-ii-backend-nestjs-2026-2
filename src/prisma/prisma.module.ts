import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  // PrismaService queda disponible dentro de este módulo.
  providers: [PrismaService],

  // Exportarlo permite inyectarlo desde otros módulos, como UsersModule o AuthModule.
  exports: [PrismaService],
})
export class PrismaModule {}