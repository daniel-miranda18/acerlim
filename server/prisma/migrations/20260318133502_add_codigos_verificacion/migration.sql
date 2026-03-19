-- CreateTable
CREATE TABLE `codigos_verificacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `codigo` VARCHAR(6) NOT NULL,
    `expira_en` DATETIME(3) NOT NULL,
    `usado` TINYINT NOT NULL DEFAULT 0,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `codigos_verificacion` ADD CONSTRAINT `codigos_verificacion_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
