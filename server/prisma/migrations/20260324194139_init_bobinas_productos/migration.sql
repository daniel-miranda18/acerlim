-- CreateTable
CREATE TABLE `bobinas` (
    `id_bobina` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_lote` VARCHAR(50) NULL,
    `color` VARCHAR(50) NULL,
    `espesor` DECIMAL(5, 2) NULL,
    `ancho` DECIMAL(8, 2) NULL,
    `peso_inicial` DECIMAL(10, 2) NULL,
    `peso_actual` DECIMAL(10, 2) NULL,
    `fecha_ingreso` DATE NULL,
    `proveedor` VARCHAR(100) NULL,
    `estado_bobina` VARCHAR(50) NULL,
    `estado` TINYINT NOT NULL DEFAULT 1,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NULL,
    `usuario_creacion` INTEGER NULL,
    `usuario_actualizacion` INTEGER NULL,

    PRIMARY KEY (`id_bobina`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productos` (
    `id_producto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NULL,
    `descripcion` TEXT NULL,
    `color` VARCHAR(50) NULL,
    `medida_largo` DECIMAL(10, 2) NULL,
    `medida_ancho` DECIMAL(10, 2) NULL,
    `estado` TINYINT NOT NULL DEFAULT 1,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NULL,
    `usuario_creacion` INTEGER NULL,
    `usuario_actualizacion` INTEGER NULL,

    PRIMARY KEY (`id_producto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
