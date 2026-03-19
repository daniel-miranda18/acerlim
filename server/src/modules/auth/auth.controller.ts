import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { env } from "../../shared/config/env";
import {
  ok,
  unauthorized,
  badRequest,
  serverError,
} from "../../shared/utils/response";
import prisma from "../../shared/lib/prisma";
import { sendMail } from "../../shared/lib/mailer";
import { get2FAEmailHTML } from "../../shared/lib/email-templates";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  const masked =
    local.length <= 3
      ? local[0] + "***"
      : local.slice(0, 2) + "***" + local.slice(-1);
  return `${masked}@${domain}`;
}

export const authController = {
  login: (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      async (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) {
          return unauthorized(res, info?.message || "Credenciales inválidas");
        }
        try {
          await prisma.codigoVerificacion.updateMany({
            where: { id_usuario: user.id_usuario, usado: 0 },
            data: { usado: 1 },
          });
          const codigo = generateCode();
          const expiraEn = new Date(Date.now() + 5 * 60 * 1000);
          await prisma.codigoVerificacion.create({
            data: {
              id_usuario: user.id_usuario,
              codigo,
              expira_en: expiraEn,
            },
          });
          const html = get2FAEmailHTML(codigo, user.nombre);
          await sendMail(user.correo, "Código de verificación — Acerlim", html);
          return ok(
            res,
            {
              requires2FA: true,
              id_usuario: user.id_usuario,
              correo: maskEmail(user.correo),
            },
            "Código de verificación enviado a tu correo",
          );
        } catch (e) {
          console.error("Error sending 2FA code:", e);
          return serverError(res);
        }
      },
    )(req, res, next);
  },

  verify2FA: async (req: Request, res: Response) => {
    try {
      const { id_usuario, codigo } = req.body;

      if (!id_usuario || !codigo) {
        return badRequest(res, "Faltan datos requeridos");
      }

      const record = await prisma.codigoVerificacion.findFirst({
        where: {
          id_usuario: Number(id_usuario),
          codigo: String(codigo),
          usado: 0,
        },
        orderBy: { fecha_creacion: "desc" },
      });

      if (!record) {
        return unauthorized(res, "Código inválido");
      }

      if (new Date() > record.expira_en) {
        await prisma.codigoVerificacion.update({
          where: { id: record.id },
          data: { usado: 1 },
        });
        return unauthorized(res, "El código ha expirado. Solicita uno nuevo");
      }

      await prisma.codigoVerificacion.update({
        where: { id: record.id },
        data: { usado: 1 },
      });

      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario: Number(id_usuario) },
        include: { rol: { select: { id_rol: true, nombre: true } } },
      });

      if (!usuario) {
        return unauthorized(res, "Usuario no encontrado");
      }

      const { clave: _, ...userWithoutSensitive } = usuario;

      const token = jwt.sign(
        { id: usuario.id_usuario, correo: usuario.correo },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN as any },
      );

      return ok(res, { user: userWithoutSensitive, token }, "Bienvenido!");
    } catch (e) {
      console.error("Error verifying 2FA:", e);
      return serverError(res);
    }
  },

  resend2FA: async (req: Request, res: Response) => {
    try {
      const { id_usuario } = req.body;
      if (!id_usuario) {
        return badRequest(res, "Faltan datos requeridos");
      }
      const usuario = await prisma.usuario.findUnique({
        where: { id_usuario: Number(id_usuario) },
      });
      if (!usuario) {
        return unauthorized(res, "Usuario no encontrado");
      }
      await prisma.codigoVerificacion.updateMany({
        where: { id_usuario: usuario.id_usuario, usado: 0 },
        data: { usado: 1 },
      });
      const codigo = generateCode();
      const expiraEn = new Date(Date.now() + 5 * 60 * 1000);
      await prisma.codigoVerificacion.create({
        data: {
          id_usuario: usuario.id_usuario,
          codigo,
          expira_en: expiraEn,
        },
      });
      const html = get2FAEmailHTML(codigo, usuario.nombre);
      await sendMail(usuario.correo, "Código de verificación — Acerlim", html);
      return ok(
        res,
        { correo: maskEmail(usuario.correo) },
        "Nuevo código enviado",
      );
    } catch (e) {
      console.error("Error resending 2FA:", e);
      return serverError(res);
    }
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
