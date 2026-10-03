import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    // El service usa el repository para acceder a la base de datos.
    private readonly usersRepository: UsersRepository,

    // ConfigService permite leer variables como BCRYPT_SALT_ROUNDS.
    private readonly config: ConfigService,
  ) {}

  // Caso de uso: listar usuarios.
  findMany() {
    return this.usersRepository.findMany();
  }

  // Caso de uso: buscar un usuario y lanzar error si no existe.
  async findOne(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  // Método usado por autenticación.
  // Devuelve passwordHash porque login necesita compararlo con bcrypt.
  findByEmailWithPassword(email: string) {
    return this.usersRepository.findByEmailWithPassword(email);
  }

  // Caso de uso: crear usuario.
  // Aquí validamos reglas de negocio, como no repetir correos.
  async create(dto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmailWithPassword(dto.email);

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const passwordHash = await this.hashPassword(dto.password);

    // Guardamos passwordHash, nunca dto.password.
    return this.usersRepository.create({
      email: dto.email,
      name: dto.name,
      lastname: dto.lastname,
      phone: dto.phone,
      address: dto.address,
      birthdate: dto.birthdate ? new Date(dto.birthdate) : undefined,
      foto: dto.foto,
      passwordHash,
      role: dto.role,
    });
  }

  // Caso de uso: actualizar usuario.
  // Si viene password, lo convertimos a hash antes de guardar.
  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const passwordHash = dto.password ? await this.hashPassword(dto.password) : undefined;

    return this.usersRepository.update(id, {
      email: dto.email,
      name: dto.name,
      lastname: dto.lastname,
      phone: dto.phone,
      address: dto.address,
      birthdate: dto.birthdate ? new Date(dto.birthdate) : undefined,
      foto: dto.foto,
      passwordHash,
      role: dto.role,
      isActive: dto.isActive,
    });
  }

  // Caso de uso: "eliminar" usuario.
  // Realmente lo desactivamos para no perder información histórica.
  async remove(id: string) {
    await this.findOne(id);
    return this.usersRepository.deactivate(id);
  }

  // Helper privado: solo este service necesita saber cómo hashear passwords.
  private hashPassword(password: string) {
    const saltRounds = this.config.getOrThrow<number>('BCRYPT_SALT_ROUNDS');
    return bcrypt.hash(password, saltRounds);
  }
}