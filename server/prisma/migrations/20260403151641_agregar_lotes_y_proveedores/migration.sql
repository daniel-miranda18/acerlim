/*
  Warnings:

  - You are about to drop the column `codigo_lote` on the `bobinas` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_ingreso` on the `bobinas` table. All the data in the column will be lost.
  - You are about to drop the column `proveedor` on the `bobinas` table. All the data in the column will be lost.
  - Added the required column `id_lote` to the `bobinas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bobinas` DROP COLUMN `codigo_lote`,
    DROP COLUMN `fecha_ingreso`,
    DROP COLUMN `proveedor`,
    ADD COLUMN `id_lote` INTEGER NOT NULL,
    ADD COLUMN `metros_lineales_actual` DECIMAL(10, 2) NULL,
    ADD COLUMN `metros_lineales_inicial` DECIMAL(10, 2) NULL;

-- CreateTable
CREATE TABLE `lotes` (
    `id_lote` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_lote` VARCHAR(50) NOT NULL,
    `id_proveedor` INTEGER NULL,
    `fecha_ingreso` DATE NULL,
    `estado` TINYINT NOT NULL DEFAULT 1,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NULL,
    `usuario_creacion` INTEGER NULL,
    `usuario_actualizacion` INTEGER NULL,

    UNIQUE INDEX `lotes_codigo_lote_key`(`codigo_lote`),
    PRIMARY KEY (`id_lote`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proveedores` (
    `id_proveedor` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `contacto` VARCHAR(100) NULL,
    `telefono` VARCHAR(20) NULL,
    `correo` VARCHAR(120) NULL,
    `direccion` TEXT NULL,
    `estado` TINYINT NOT NULL DEFAULT 1,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NULL,
    `usuario_creacion` INTEGER NULL,
    `usuario_actualizacion` INTEGER NULL,

    PRIMARY KEY (`id_proveedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productos_dibujos` (
    `id_dibujo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_producto` INTEGER NOT NULL,
    `largo` DECIMAL(10, 2) NOT NULL,
    `ancho` DECIMAL(10, 2) NOT NULL,
    `area_plana` DECIMAL(12, 2) NULL,
    `area_proyectada` DECIMAL(12, 2) NULL,
    `configuracion_calculo` JSON NULL,
    `datos_json` TEXT NULL,
    `imagen_generada` TEXT NULL,
    `estado` TINYINT NOT NULL DEFAULT 1,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NULL,
    `usuario_creacion` INTEGER NULL,
    `usuario_actualizacion` INTEGER NULL,

    PRIMARY KEY (`id_dibujo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bobinas` ADD CONSTRAINT `bobinas_id_lote_fkey` FOREIGN KEY (`id_lote`) REFERENCES `lotes`(`id_lote`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lotes` ADD CONSTRAINT `lotes_id_proveedor_fkey` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores`(`id_proveedor`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productos_dibujos` ADD CONSTRAINT `productos_dibujos_id_producto_fkey` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`) ON DELETE RESTRICT ON UPDATE CASCADE;
