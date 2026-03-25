import "dotenv/config";
import prisma from "../src/shared/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Iniciando el sembrado de la base de datos...");
  try {
    const gerenteRol = await prisma.rol.upsert({
      where: { id_rol: 1 },
      update: { nombre: "Gerente", descripcion: "Acceso total al sistema" },
      create: {
        id_rol: 1,
        nombre: "Gerente",
        descripcion: "Acceso total al sistema",
        estado: 1,
      },
    });

    await prisma.rol.upsert({
      where: { id_rol: 2 },
      update: { nombre: "Operador en Producción", descripcion: "Módulo de producción" },
      create: {
        id_rol: 2,
        nombre: "Operador en Producción",
        descripcion: "Módulo de producción",
        estado: 1,
      },
    });

    await prisma.rol.upsert({
      where: { id_rol: 3 },
      update: { nombre: "Vendedor", descripcion: "Módulo de ventas" },
      create: {
        id_rol: 3,
        nombre: "Vendedor",
        descripcion: "Módulo de ventas",
        estado: 1,
      },
    });

    console.log("Roles creados/verificados correctamente");

    const adminClave = await bcrypt.hash("admin123", 10);
    
    const adminUser = await prisma.usuario.upsert({
      where: { correo: "admin@acerlim.com" },
      update: {},
      create: {
        nombre: "Gerente del Sistema",
        correo: "admin@acerlim.com",
        clave: adminClave,
        id_rol: gerenteRol.id_rol,
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
