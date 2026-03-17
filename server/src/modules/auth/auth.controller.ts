import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { env } from "../../shared/config/env";
import { ok, unauthorized, serverError } from "../../shared/utils/response";

export const authController = {
  login: (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err) return next(err);

        if (!user) {
          return unauthorized(res, info?.message || "Credenciales inválidas");
        }

        const token = jwt.sign(
          { id: user.id_usuario, correo: user.correo },
          env.JWT_SECRET,
          { expiresIn: env.JWT_EXPIRES_IN as any }
        );

        return ok(res, { user, token }, "Bienvenido!");
      }
    )(req, res, next);
  },

  me: async (req: Request, res: Response) => {
    try {
      if (!req.user) return unauthorized(res);
      return ok(res, req.user);
    } catch (e) {
      serverError(res);
    }
  },
};
