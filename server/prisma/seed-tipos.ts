import prisma from "../src/shared/lib/prisma";

async function main() {
  console.log("Seeding Tipos de Productos...");

  const tipos = [
    { nombre: "Trapezoidal" },
    { nombre: "Ondulado" },
    { nombre: "Teja" }
  ];

  for (const tipo of tipos) {
    const exists = await prisma.tipoProducto.findFirst({
      where: { nombre: tipo.nombre }
    });

    if (!exists) {
      await prisma.tipoProducto.create({
        data: tipo
      });
      console.log(`Creado tipo: ${tipo.nombre}`);
    } else {
      console.log(`El tipo ${tipo.nombre} ya existe.`);
    }
  }

  console.log("Seeding completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
