import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Campos públicos que se devolverán al cliente.
// Importante: passwordHash no aparece aquí, así evitamos exponerlo por accidente.
const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  phone: true,
  address: true,
  birthdate: true,
  foto: true,
  lastname: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersRepository {
  // El repository habla directamente con Prisma.
  // Si mañana cambias detalles de consulta, normalmente los cambias aquí.
  constructor(private readonly prisma: PrismaService) {}

  // Lista usuarios ordenados del más reciente al más antiguo.
  findMany() {
    return this.prisma.user.findMany({
      select: publicUserSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Busca por id y devuelve solo campos públicos.
  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  }

  // Este método sí trae passwordHash porque autenticación necesita comparar passwords.
  // No lo uses para responder directamente al cliente.
  findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Crea el usuario en base de datos.
  // Recibe passwordHash, no password plano.
  create(data: {
    email: string;
    name: string;
    lastname?: string;
    phone?: string;
    address?: string;
    birthdate?: Date;
    foto?: string;
    passwordHash: string;
    role?: 'ADMIN' | 'USER' | 'SUPERVISOR';
  }) {
    return this.prisma.user.create({
      data,
      select: publicUserSelect,
    });
  }

  // Actualiza solo los campos recibidos.
  // Partial permite enviar un objeto con una parte de los campos.
  update(
    id: string,
    data: Partial<{
      email: string;
      name: string;
      lastname?: string;
      phone?: string;
      address?: string;
      birthdate?: Date;
      foto?: string;
      passwordHash: string;
      role: 'ADMIN' | 'USER' | 'SUPERVISOR';
      isActive: boolean;
    }>,
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: publicUserSelect,
    });
  }

  // En este tutorial no borramos físicamente el usuario.
  // Lo marcamos como inactivo para conservar historial.
  deactivate(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: publicUserSelect,
    });
  }

}