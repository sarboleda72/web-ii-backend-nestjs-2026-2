import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { HerramientasController } from './herramientas.controller';
import { HerramientasRepository } from './herramientas.repository';
import { HerramientasService } from './herramientas.service';

@Module({
  imports: [PrismaModule],
  controllers: [HerramientasController],
  providers: [HerramientasService, HerramientasRepository],
  exports: [HerramientasService],
})
export class HerramientasModule {}
