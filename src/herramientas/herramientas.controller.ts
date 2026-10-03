import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateHerramientaDto } from './dto/create-herramienta.dto';
import { UpdateHerramientaDto } from './dto/update-herramienta.dto';
import { HerramientasService } from './herramientas.service';

// Rutas finales: /api/v1/herramientas
@Controller('herramientas')
export class HerramientasController {
  constructor(private readonly herramientasService: HerramientasService) {}

  @Post()
  create(@Body() dto: CreateHerramientaDto) {
    return this.herramientasService.create(dto);
  }

  @Get()
  findMany(@Query('q') q?: string) {
    // Si viene ?q=texto, buscamos; si no, listamos todo.
    return q ? this.herramientasService.search(q) : this.herramientasService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.herramientasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHerramientaDto) {
    return this.herramientasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.herramientasService.remove(id);
  }
}
