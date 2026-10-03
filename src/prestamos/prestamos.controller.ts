import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { PrestamosService } from './prestamos.service';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Post()
  create(@Body() dto: CreatePrestamoDto) {
    return this.prestamosService.create(dto);
  }

  @Get()
  findMany(@Query('q') q?: string) {
    return q ? this.prestamosService.search(q) : this.prestamosService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prestamosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePrestamoDto) {
    return this.prestamosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prestamosService.remove(id);
  }
}
