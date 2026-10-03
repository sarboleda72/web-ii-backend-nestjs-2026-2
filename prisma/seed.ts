import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client';

// El seed también necesita conectarse a PostgreSQL usando la misma DATABASE_URL.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Usuario inicial para entrar al sistema. Puedes cambiar correo, nombre y password.
  const passwordHash = await bcrypt.hash('Admin123456!', 12);

  // upsert evita duplicar el admin si ejecutas el seed varias veces.
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrador',
      passwordHash,
      role: 'ADMIN',
    },
  });

  // upsert evita duplicar el admin si ejecutas el seed varias veces.
  await prisma.user.upsert({
    where: { email: 'santiago@uam.com' },
    update: {},
    create: {
      email: 'santiago@uam.com',
      name: 'Santiago Arboleda Agudelo',
      passwordHash,
      role: 'ADMIN',
    },
  });

  // Herramientas de ejemplo para que el CRUD del módulo 2 tenga datos al listar.
  const herramientas = [
    { nombre: 'Taladro percutor', descripcion: 'Taladro eléctrico 750W con maletín', categoria: 'Eléctricas', stock: 8, disponible: true },
    { nombre: 'Llave de tuercas', descripcion: 'Juego de llaves mixtas 8-19mm', categoria: 'Manuales', stock: 15, disponible: true },
    { nombre: 'Sierra circular', descripcion: 'Sierra 1400W con guía láser', categoria: 'Eléctricas', stock: 3, disponible: true },
    { nombre: 'Multímetro digital', descripcion: 'Medidor de voltaje, corriente y resistencia', categoria: 'Medición', stock: 10, disponible: true },
  ];

  for (const h of herramientas) {
    // Evita duplicar si el seed se ejecuta varias veces.
    const existe = await prisma.herramienta.findFirst({ where: { nombre: h.nombre } });

    if (!existe) {
      await prisma.herramienta.create({ data: h });
    }
  }

  // Préstamo de ejemplo conectando usuario y herramienta.
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const taladro = await prisma.herramienta.findFirst({ where: { nombre: 'Taladro percutor' } });

  if (admin && taladro) {
    const existePrestamo = await prisma.prestamo.findFirst({
      where: { usuarioId: admin.id, herramientaId: taladro.id },
    });

    if (!existePrestamo) {
      await prisma.prestamo.create({
        data: { usuarioId: admin.id, herramientaId: taladro.id, estado: 'ACTIVO' },
      });
    }
  }
}

main()
  .then(async () => {
    // Cierra la conexión cuando el seed termina correctamente.
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    // También cerramos la conexión si ocurre un error.
    await prisma.$disconnect();
    process.exit(1);
  });