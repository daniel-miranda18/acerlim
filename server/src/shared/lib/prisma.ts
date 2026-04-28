import { PrismaClient } from "../../generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "../config/env";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined. Please check your .env file.");
}

const adapter = new PrismaMariaDb(env.DATABASE_URL);
const basePrisma = new PrismaClient({ adapter });

const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const result = await query(args);

        const auditActions = ["create", "update", "delete", "createMany", "updateMany", "deleteMany"];

        if (
          auditActions.includes(operation) &&
          model !== "Auditoria" &&
          model !== "EventoHttp" &&
          model !== "Sesion"
        ) {
          try {
            // No podemos acceder fácilmente al usuario aquí sin AsyncLocalStorage
            // Por ahora registramos la acción
            await basePrisma.auditoria.create({
              data: {
                tabla_afectada: model,
                accion: operation,
                descripcion: `Ejecutó ${operation} en ${model}`,
                id_registro: (result as any)?.id || (result as any)?.id_usuario || (result as any)?.id_producto || null,
              }
            });
          } catch (e) {
            console.error("Failed to insert audit log", e);
          }
        }

        return result;
      },
    },
  },
});

export default prisma;
