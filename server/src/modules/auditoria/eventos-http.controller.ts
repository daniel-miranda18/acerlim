import { Request, Response } from "express";
import prisma from "../../shared/lib/prisma";

export const getEventosHttp = async (req: Request, res: Response) => {
  try {
    const records = await prisma.eventoHttp.findMany({
      orderBy: { fecha_evento: "desc" },
      include: {
        usuario: {
          select: { nombre: true, correo: true },
        },
      },
    });
    res.json(records);
  } catch (error) {
    console.error("Error fetching eventos_http:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
