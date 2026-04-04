-- AlterTable
ALTER TABLE `productos` ADD COLUMN `id_tipo_producto` INTEGER NULL;

-- CreateTable
CREATE TABLE `tipos_productos` (
    `id_tipo_producto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `estado` TINYINT NOT NULL DEFAULT 1,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NULL,
    `usuario_creacion` INTEGER NULL,
    `usuario_actualizacion` INTEGER NULL,

    PRIMARY KEY (`id_tipo_producto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `productos_id_tipo_producto_fkey` FOREIGN KEY (`id_tipo_producto`) REFERENCES `tipos_productos`(`id_tipo_producto`) ON DELETE SET NULL ON UPDATE CASCADE;
