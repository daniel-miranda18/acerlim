import { Request, Response } from "express";
import prisma from "../../shared/lib/prisma";

export const getAuditoria = async (req: Request, res: Response) => {
  try {
    const records = await prisma.auditoria.findMany({
      orderBy: { fecha_evento: "desc" },
      include: {
        usuario: {
          select: { nombre: true, correo: true },
        },
      },
    });
    res.json(records);
  } catch (error) {
    console.error("Error fetching auditoria:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
