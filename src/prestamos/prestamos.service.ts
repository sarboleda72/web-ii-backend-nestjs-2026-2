import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { PrestamosRepository } from './prestamos.repository';

@Injectable()
export class PrestamosService {
  constructor(private readonly prestamosRepository: PrestamosRepository) {}

  findMany() {
    return this.prestamosRepository.findMany();
  }

  async findOne(id: string) {
    const prestamo = await this.prestamosRepository.findById(id);

    if (!prestamo) {
      throw new NotFoundException('Préstamo no encontrado');
    }

    return prestamo;
  }

  search(q: string) {
    return this.prestamosRepository.search(q);
  }

  create(dto: CreatePrestamoDto) {
    return this.prestamosRepository.create({
      usuarioId: dto.usuarioId,
      herramientaId: dto.herramientaId,
      fechaPrestamo: dto.fechaPrestamo ? new Date(dto.fechaPrestamo) : undefined,
    });
  }

  async update(id: string, dto: UpdatePrestamoDto) {
    await this.findOne(id);

    return this.prestamosRepository.update(id, {
      usuarioId: dto.usuarioId,
      herramientaId: dto.herramientaId,
      fechaPrestamo: dto.fechaPrestamo ? new Date(dto.fechaPrestamo) : undefined,
      fechaDevolucion: dto.fechaDevolucion ? new Date(dto.fechaDevolucion) : undefined,
      estado: dto.estado,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prestamosRepository.devolver(id);
  }
}
