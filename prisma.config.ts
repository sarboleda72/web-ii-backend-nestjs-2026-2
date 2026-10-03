import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Ruta del schema principal de Prisma. Normalmente no necesitas cambiarla.
  schema: 'prisma/schema.prisma',

  // Prisma guardará aquí las migraciones y también sabrá cómo ejecutar el seed.
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },

  // DATABASE_URL viene del archivo .env. Es la conexión real a PostgreSQL.
  datasource: {
    url: env('DATABASE_URL'),
  },
});