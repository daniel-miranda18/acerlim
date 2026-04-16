import prisma from "../../shared/lib/prisma";
import { CrearProduccionDTO } from "./produccion.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatProduccion = (p: any) => ({
  ...p,
  metros_consumidos: p.metros_consumidos ? Number(p.metros_consumidos) : 0,
  fecha_creacion: formatDate(p.fecha_creacion),
  fecha_actualizacion: formatDate(p.fecha_actualizacion),
  bobina: p.bobina
    ? {
        ...p.bobina,
        espesor: p.bobina.espesor ? Number(p.bobina.espesor) : null,
        ancho: p.bobina.ancho ? Number(p.bobina.ancho) : null,
        peso_inicial: p.bobina.peso_inicial ? Number(p.bobina.peso_inicial) : null,
        peso_actual: p.bobina.peso_actual ? Number(p.bobina.peso_actual) : null,
        metros_lineales_inicial: p.bobina.metros_lineales_inicial ? Number(p.bobina.metros_lineales_inicial) : null,
        metros_lineales_actual: p.bobina.metros_lineales_actual ? Number(p.bobina.metros_lineales_actual) : null,
      }
    : null,
});

export const produccionRepository = {
  findByPedido: async (id_pedido: number) => {
    const producciones = await prisma.produccion.findMany({
      where: { id_pedido, estado: 1 },
      include: {
        bobina: {
          include: {
            lote_rel: true,
            color_rel: true,
          },
        },
      },
      orderBy: { id_produccion: "desc" },
    });
    return producciones.map(formatProduccion);
  },

  create: async (data: CrearProduccionDTO, usuarioCreacion: number) => {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify bobina has enough metros
      const bobina = await tx.bobina.findUnique({
        where: { id_bobina: data.id_bobina },
      });
      if (!bobina) throw new Error("Bobina no encontrada");

      const metrosActuales = Number(bobina.metros_lineales_actual ?? 0);
      if (metrosActuales < data.metros_consumidos) {
        throw new Error(
          `La bobina solo tiene ${metrosActuales.toFixed(2)} metros disponibles, se requieren ${data.metros_consumidos.toFixed(2)} metros`
        );
      }

      // 2. Create production record
      const produccion = await tx.produccion.create({
        data: {
          id_pedido: data.id_pedido,
          id_bobina: data.id_bobina,
          metros_consumidos: data.metros_consumidos,
          observaciones: data.observaciones ?? null,
          usuario_creacion: usuarioCreacion,
        },
        include: {
          bobina: {
            include: {
              lote_rel: true,
              color_rel: true,
            },
          },
        },
      });

      // 3. Deduct metros from bobina
      await tx.bobina.update({
        where: { id_bobina: data.id_bobina },
        data: {
          metros_lineales_actual: metrosActuales - data.metros_consumidos,
          fecha_actualizacion: now(),
        },
      });

      // 4. Update pedido estado to produccion
      await tx.pedido.update({
        where: { id_pedido: data.id_pedido },
        data: {
          estado_pedido: "produccion",
          fecha_actualizacion: now(),
        },
      });

      return produccion;
    });

    return formatProduccion(result);
  },
};
