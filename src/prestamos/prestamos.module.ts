import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrestamosController } from './prestamos.controller';
import { PrestamosRepository } from './prestamos.repository';
import { PrestamosService } from './prestamos.service';

@Module({
  imports: [PrismaModule],
  controllers: [PrestamosController],
  providers: [PrestamosService, PrestamosRepository],
  exports: [PrestamosService],
})
export class PrestamosModule {}
