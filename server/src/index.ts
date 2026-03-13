import app from "./app";
import { env } from "./shared/config/env";
import prisma from "./shared/lib/prisma";

app.listen(env.PORT, async () => {
  console.log(`Servidor corriendo en el puerto: ${env.PORT}`);
  console.log(`Entorno: ${env.NODE_ENV}`);
  try {
    await prisma.$connect();
    console.log("Prisma conectado a la Base de Datos");
  } catch (e) {
    console.error("Error conectando Prisma:", e);
  }
});
