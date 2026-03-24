import { Request, Response, NextFunction } from "express";
import { unauthorized, forbidden } from "../utils/response";

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return unauthorized(res, "No autorizado");
    }

    const userRole = (req.user as any).rol?.nombre;

    if (!userRole || !roles.includes(userRole.toLowerCase())) {
      return forbidden(res, "No tienes permisos para acceder a este recurso");
    }

    next();
  };
};
