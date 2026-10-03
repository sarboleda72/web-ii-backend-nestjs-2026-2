import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  // Importamos PrismaModule porque UsersRepository necesita PrismaService.
  imports: [PrismaModule],

  // Controllers exponen endpoints HTTP.
  controllers: [UsersController],

  // Providers son clases que NestJS puede inyectar en otras clases.
  providers: [UsersService, UsersRepository],

  // Exportamos UsersService para que AuthModule pueda usarlo en registro y login.
  exports: [UsersService],
})
export class UsersModule {}