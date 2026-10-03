import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HerramientasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany() {
    return this.prisma.herramienta.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.herramienta.findUnique({
      where: { id },
    });
  }

  // Búsqueda por nombre, descripción o categoría (insensible a mayúsculas).
  search(q: string) {
    return this.prisma.herramienta.findMany({
      where: {
        OR: [
          { nombre: { contains: q, mode: 'insensitive' } },
          { descripcion: { contains: q, mode: 'insensitive' } },
          { categoria: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: {
    nombre: string;
    descripcion?: string;
    categoria?: string;
    stock?: number;
    disponible?: boolean;
    foto?: string;
  }) {
    return this.prisma.herramienta.create({ data });
  }

  update(
    id: string,
    data: Partial<{
      nombre: string;
      descripcion?: string;
      categoria?: string;
      stock?: number;
      disponible?: boolean;
      foto?: string;
    }>,
  ) {
    return this.prisma.herramienta.update({
      where: { id },
      data,
    });
  }

  // Eliminado lógico: marcamos como no disponible en vez de borrar.
  deactivate(id: string) {
    return this.prisma.herramienta.update({
      where: { id },
      data: { disponible: false },
    });
  }
}
