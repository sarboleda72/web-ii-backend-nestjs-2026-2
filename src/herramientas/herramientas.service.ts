import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHerramientaDto } from './dto/create-herramienta.dto';
import { UpdateHerramientaDto } from './dto/update-herramienta.dto';
import { HerramientasRepository } from './herramientas.repository';

@Injectable()
export class HerramientasService {
  constructor(private readonly herramientasRepository: HerramientasRepository) {}

  findMany() {
    return this.herramientasRepository.findMany();
  }

  async findOne(id: string) {
    const herramienta = await this.herramientasRepository.findById(id);

    if (!herramienta) {
      throw new NotFoundException('Herramienta no encontrada');
    }

    return herramienta;
  }

  search(q: string) {
    return this.herramientasRepository.search(q);
  }

  create(dto: CreateHerramientaDto) {
    return this.herramientasRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      categoria: dto.categoria,
      stock: dto.stock,
      disponible: dto.disponible,
      foto: dto.foto,
    });
  }

  async update(id: string, dto: UpdateHerramientaDto) {
    await this.findOne(id);

    return this.herramientasRepository.update(id, {
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      categoria: dto.categoria,
      stock: dto.stock,
      disponible: dto.disponible,
      foto: dto.foto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.herramientasRepository.deactivate(id);
  }
}
