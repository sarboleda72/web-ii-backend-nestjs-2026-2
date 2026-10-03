-- CreateTable
CREATE TABLE "Herramienta" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoria" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Herramienta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Herramienta_categoria_idx" ON "Herramienta"("categoria");

-- CreateIndex
CREATE INDEX "Herramienta_disponible_idx" ON "Herramienta"("disponible");
