import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const prestamoInclude = {
  usuario: { select: { id: true, name: true, lastname: true, email: true } },
  herramienta: { select: { id: true, nombre: true, categoria: true } },
};

@Injectable()
export class PrestamosRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany() {
    return this.prisma.prestamo.findMany({
      include: prestamoInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.prestamo.findUnique({
      where: { id },
      include: prestamoInclude,
    });
  }

  search(q: string) {
    return this.prisma.prestamo.findMany({
      where: {
        OR: [
          { usuario: { name: { contains: q, mode: 'insensitive' } } },
          { herramienta: { nombre: { contains: q, mode: 'insensitive' } } },
          { estado: { contains: q, mode: 'insensitive' } },
        ],
      },
      include: prestamoInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: { usuarioId: string; herramientaId: string; fechaPrestamo?: Date }) {
    return this.prisma.prestamo.create({ data, include: prestamoInclude });
  }

  update(
    id: string,
    data: Partial<{
      usuarioId: string;
      herramientaId: string;
      fechaPrestamo?: Date;
      fechaDevolucion?: Date;
      estado: string;
    }>,
  ) {
    return this.prisma.prestamo.update({ where: { id }, data, include: prestamoInclude });
  }

  // Al "eliminar" marcamos el préstamo como devuelto.
  devolver(id: string) {
    return this.prisma.prestamo.update({
      where: { id },
      data: { estado: 'DEVUELTO', fechaDevolucion: new Date() },
      include: prestamoInclude,
    });
  }
}
