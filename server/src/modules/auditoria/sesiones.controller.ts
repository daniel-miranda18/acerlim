import { Request, Response } from "express";
import prisma from "../../shared/lib/prisma";

export const getSesiones = async (req: Request, res: Response) => {
  try {
    const records = await prisma.sesion.findMany({
      orderBy: { fecha_inicio: "desc" },
      include: {
        usuario: {
          select: { nombre: true, correo: true },
        },
      },
    });
    res.json(records);
  } catch (error) {
    console.error("Error fetching sesiones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
