import prisma from "../../shared/lib/prisma";
import { CrearPrecioDTO, ActualizarPrecioDTO } from "./precio.schema";
import { formatDate, now } from "../../shared/utils/date";

const formatPrecio = (p: any) => ({
  ...p,
  precio_por_metro: p.precio_por_metro ? Number(p.precio_por_metro) : null,
  fecha_creacion: formatDate(p.fecha_creacion),
  fecha_actualizacion: formatDate(p.fecha_actualizacion),
});

export const precioRepository = {
  findAll: async () => {
    const precios = await prisma.precioMetro.findMany({
      where: { estado: 1 },
      orderBy: { id_precio: "desc" },
    });
    return precios.map(formatPrecio);
  },

  findById: async (id: number) => {
    const p = await prisma.precioMetro.findUnique({
      where: { id_precio: id },
    });
    if (!p) return null;
    return formatPrecio(p);
  },

  create: async (data: CrearPrecioDTO) => {
    const p = await prisma.precioMetro.create({
      data: {
        nombre: data.nombre,
        precio_por_metro: data.precio_por_metro,
        moneda: data.moneda ?? "BOB",
      },
    });
    return formatPrecio(p);
  },

  update: async (id: number, data: ActualizarPrecioDTO) => {
    const p = await prisma.precioMetro.update({
      where: { id_precio: id },
      data: {
        ...data,
        fecha_actualizacion: now(),
      },
    });
    return formatPrecio(p);
  },

  delete: async (id: number) => {
    const p = await prisma.precioMetro.update({
      where: { id_precio: id },
      data: { estado: 0, fecha_actualizacion: now() },
    });
    return formatPrecio(p);
  },
};
