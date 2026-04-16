import prisma from "../../shared/lib/prisma";
import { CrearPedidoDTO, ActualizarPedidoDTO } from "./pedido.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatPedido = (p: any) => ({
  ...p,
  subtotal: p.subtotal ? Number(p.subtotal) : null,
  total: p.total ? Number(p.total) : null,
  fecha_creacion: formatDate(p.fecha_creacion),
  fecha_actualizacion: formatDate(p.fecha_actualizacion),
  detalles: p.detalles?.map((d: any) => ({
    ...d,
    cantidad: Number(d.cantidad),
    precio_unitario: Number(d.precio_unitario),
    subtotal: d.subtotal ? Number(d.subtotal) : null,
  })) ?? [],
});

export const pedidoRepository = {
  findAll: async () => {
    const pedidos = await prisma.pedido.findMany({
      where: { estado: 1 },
      include: {
        detalles: {
          where: { estado: 1 },
          include: { producto: { include: { tipo_producto: true } } },
        },
        dibujo: true,
      },
      orderBy: { id_pedido: "desc" },
    });
    return pedidos.map(formatPedido);
  },

  findById: async (id: number) => {
    const p = await prisma.pedido.findUnique({
      where: { id_pedido: id },
      include: {
        detalles: {
          where: { estado: 1 },
          include: { producto: { include: { tipo_producto: true } } },
        },
        dibujo: true,
      },
    });
    if (!p) return null;
    return formatPedido(p);
  },

  create: async (data: CrearPedidoDTO, usuarioCreacion: number) => {
    const { detalles, ...pedidoData } = data;

    const p = await prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          nombre_cliente: pedidoData.nombre_cliente,
          fecha: new Date(pedidoData.fecha),
          id_dibujo: pedidoData.id_dibujo,
          subtotal: pedidoData.subtotal,
          total: pedidoData.total,
          observaciones: pedidoData.observaciones,
          usuario_creacion: usuarioCreacion,
          detalles: {
            create: detalles.map((d) => ({
              id_producto: d.id_producto,
              cantidad: d.cantidad,
              precio_unitario: d.precio_unitario,
              subtotal: d.cantidad * d.precio_unitario,
            })),
          },
        },
        include: {
          detalles: {
            include: { producto: { include: { tipo_producto: true } } },
          },
          dibujo: true,
        },
      });
      return pedido;
    });

    return formatPedido(p);
  },

  update: async (id: number, data: ActualizarPedidoDTO, usuarioActualizacion: number) => {
    const { detalles, ...pedidoData } = data;

    const p = await prisma.$transaction(async (tx) => {
      // Update main order
      const pedido = await tx.pedido.update({
        where: { id_pedido: id },
        data: {
          ...pedidoData,
          fecha: pedidoData.fecha ? new Date(pedidoData.fecha) : undefined,
          fecha_actualizacion: now(),
          usuario_actualizacion: usuarioActualizacion,
        },
      });

      // If detalles provided, soft-delete old and create new
      if (detalles) {
        await tx.pedidoDetalle.updateMany({
          where: { id_pedido: id },
          data: { estado: 0 },
        });

        for (const d of detalles) {
          await tx.pedidoDetalle.create({
            data: {
              id_pedido: id,
              id_producto: d.id_producto,
              cantidad: d.cantidad,
              precio_unitario: d.precio_unitario,
              subtotal: d.cantidad * d.precio_unitario,
            },
          });
        }
      }

      return tx.pedido.findUnique({
        where: { id_pedido: id },
        include: {
          detalles: { where: { estado: 1 }, include: { producto: { include: { tipo_producto: true } } } },
          dibujo: true,
        },
      });
    });

    return formatPedido(p);
  },

  delete: async (id: number) => {
    const p = await prisma.pedido.update({
      where: { id_pedido: id },
      data: { estado: 0, fecha_actualizacion: now() },
    });
    return formatPedido(p);
  },

  updateEstado: async (id: number, estado_pedido: string) => {
    const p = await prisma.pedido.update({
      where: { id_pedido: id },
      data: { estado_pedido, fecha_actualizacion: now() },
      include: {
        detalles: {
          where: { estado: 1 },
          include: { producto: { include: { tipo_producto: true } } },
        },
        dibujo: true,
      },
    });
    return formatPedido(p);
  },
};
