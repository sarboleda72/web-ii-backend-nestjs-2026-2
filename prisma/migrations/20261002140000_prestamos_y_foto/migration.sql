-- AlterTable
ALTER TABLE "User" ADD COLUMN "foto" TEXT;

-- AlterTable
ALTER TABLE "Herramienta" ADD COLUMN "foto" TEXT;

-- CreateTable
CREATE TABLE "Prestamo" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "herramientaId" TEXT NOT NULL,
    "fechaPrestamo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaDevolucion" TIMESTAMP(3),
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prestamo_usuarioId_idx" ON "Prestamo"("usuarioId");

-- CreateIndex
CREATE INDEX "Prestamo_herramientaId_idx" ON "Prestamo"("herramientaId");

-- CreateIndex
CREATE INDEX "Prestamo_estado_idx" ON "Prestamo"("estado");

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prestamo" ADD CONSTRAINT "Prestamo_herramientaId_fkey" FOREIGN KEY ("herramientaId") REFERENCES "Herramienta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
