import "dotenv/config";
import prisma from "../src/shared/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Iniciando el sembrado de la base de datos...");

  try {
    // 1. Crear Rol de Administrador
    const adminRol = await prisma.rol.upsert({
      where: { id_rol: 1 },
      update: {},
      create: {
        id_rol: 1,
        nombre: "Administrador",
        descripcion: "Acceso total al sistema",
        estado: 1,
      },
    });

    console.log("Rol de Administrador creado/verificado:", adminRol.nombre);

    // 2. Crear Usuario Administrador
    const adminClave = await bcrypt.hash("admin123", 10);
    
    const adminUser = await prisma.usuario.upsert({
      where: { correo: "admin@acerlim.com" },
      update: {},
      create: {
        nombre: "Administrador del Sistema",
        correo: "admin@acerlim.com",
        clave: adminClave,
        id_rol: adminRol.id_rol,
        estado: 1,
      },
    });

    console.log("Usuario Administrador creado/verificado:", adminUser.correo);
    console.log("Sembrado completado con éxito.");
  } catch (error) {
    console.error("Error durante el sembrado:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
