import prisma from "../../shared/lib/prisma";
import { CrearDespachoDTO } from "./despacho.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatDespacho = (d: any) => ({
  ...d,
  fecha_despacho: formatDate(d.fecha_despacho),
  fecha_creacion: formatDate(d.fecha_creacion),
  detalles: d.detalles?.map((det: any) => ({
    ...det,
    cantidad_entregada: Number(det.cantidad_entregada),
  })) ?? [],
});

export const despachoRepository = {
  findAll: async () => {
    const despachos = await prisma.despacho.findMany({
      where: { estado: 1 },
      include: {
        detalles: {
          include: {
            pedido_detalle: {
              include: {
                producto: true
              }
            }
          }
        }
      },
      orderBy: { id_despacho: "desc" },
    });
    return despachos.map(formatDespacho);
  },

  create: async (data: CrearDespachoDTO, usuarioCreacion: number) => {
    return await prisma.$transaction(async (tx) => {
      // 1. Create the Despacho
      const despacho = await tx.despacho.create({
        data: {
          receptor: data.receptor,
          observaciones: data.observaciones,
          usuario_creacion: usuarioCreacion,
          detalles: {
            create: data.detalles.map((d) => ({
              id_pedido: d.id_pedido,
              id_pedido_detalle: d.id_pedido_detalle,
              cantidad_entregada: d.cantidad_entregada,
            })),
          },
        },
      });

      // 2. Update PedidoDetalle quantities and check Pedido status
      const uniquePedidoIds = Array.from(new Set(data.detalles.map(d => d.id_pedido)));

      for (const d of data.detalles) {
        await tx.pedidoDetalle.update({
          where: { id_detalle: d.id_pedido_detalle },
          data: {
            cantidad_entregada: {
              increment: d.cantidad_entregada,
            },
          },
        });
      }

      // 3. Update status for each affected Pedido
      for (const id_pedido of uniquePedidoIds) {
        const pedido = await tx.pedido.findUnique({
          where: { id_pedido },
          include: { detalles: { where: { estado: 1 } } },
        });

        if (pedido) {
          const allDelivered = pedido.detalles.every(
            (det) => Number(det.cantidad_entregada) >= Number(det.cantidad)
          );
          const anyDelivered = pedido.detalles.some(
            (det) => Number(det.cantidad_entregada) > 0
          );

          let nuevoEstado = pedido.estado_pedido;
          if (allDelivered) {
            nuevoEstado = "entregado";
          } else if (anyDelivered) {
            nuevoEstado = "produccion"; // Or "parcialmente_entregado" if we had that state
            // The user said: "pendiente, produccion y entregado deberia ir a entregado"
            // So if it's not fully delivered, it stays in "produccion" or we keep it as it is.
            // Let's stick to "entregado" only when ALL is delivered.
          }

          if (nuevoEstado !== pedido.estado_pedido) {
            await tx.pedido.update({
              where: { id_pedido },
              data: { 
                estado_pedido: nuevoEstado,
                fecha_actualizacion: now()
              },
            });
          }
        }
      }

      return despacho;
    });
  },
};
