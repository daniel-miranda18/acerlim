import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const httpLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (body) {
    res.send = originalSend;

    const method = req.method;
    const endpoint = req.originalUrl;
    if (endpoint.startsWith("/api")) {
      const descripcion = `Status: ${res.statusCode} | IP: ${req.ip || req.connection.remoteAddress}`;
      let id_usuario: number | undefined = undefined;
      
      if (req.user && (req.user as any).id_usuario) {
        id_usuario = (req.user as any).id_usuario;
      }

      prisma.eventoHttp.create({
        data: {
          metodo: method,
          endpoint: endpoint,
          descripcion,
          id_usuario,
        },
      }).catch(err => console.error("Error logueando evento HTTP", err));
    }

    return res.send(body);
  };

  next();
};
