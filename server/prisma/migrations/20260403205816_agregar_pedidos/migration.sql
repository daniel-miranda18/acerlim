-- CreateTable
CREATE TABLE `pedidos` (
    `id_pedido` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_cliente` VARCHAR(150) NOT NULL,
    `fecha` DATE NOT NULL,
    `id_dibujo` INTEGER NULL,
    `subtotal` DECIMAL(12, 2) NULL,
    `total` DECIMAL(12, 2) NULL,
    `observaciones` TEXT NULL,
    `estado_pedido` VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    `estado` TINYINT NOT NULL DEFAULT 1,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NULL,
    `usuario_creacion` INTEGER NULL,
    `usuario_actualizacion` INTEGER NULL,

    PRIMARY KEY (`id_pedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedido_detalles` (
    `id_detalle` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pedido` INTEGER NOT NULL,
    `id_producto` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precio_unitario` DECIMAL(10, 2) NOT NULL,
    `subtotal` DECIMAL(12, 2) NULL,
    `estado` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`id_detalle`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `pedidos_id_dibujo_fkey` FOREIGN KEY (`id_dibujo`) REFERENCES `productos_dibujos`(`id_dibujo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido_detalles` ADD CONSTRAINT `pedido_detalles_id_pedido_fkey` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos`(`id_pedido`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido_detalles` ADD CONSTRAINT `pedido_detalles_id_producto_fkey` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`) ON DELETE RESTRICT ON UPDATE CASCADE;
