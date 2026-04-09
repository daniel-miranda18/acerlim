import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcryptjs";
import { env } from "./env";
import { usuarioRepository } from "../../modules/usuarios/usuario.repository";
import prisma from "../lib/prisma";

// Local Strategy for Login
passport.use(
  new LocalStrategy(
    {
      usernameField: "correo",
      passwordField: "clave",
    },
    async (correo, clave, done) => {
      try {
        const usuario = await usuarioRepository.findByCorreo(correo);

        if (!usuario) {
          return done(null, false, { message: "Usuario no encontrado" });
        }

        const match = await bcrypt.compare(clave, usuario.clave);
        if (!match) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        const { clave: _, ...userWithoutPassword } = usuario;
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const usuario = await prisma.usuario.findUnique({
          where: { id_usuario: payload.id },
          select: {
            id_usuario: true,
            nombre: true,
            correo: true,
            id_rol: true,
            estado: true,
            rol: {
              select: {
                nombre: true,
              },
            },
          },
        });

        if (!usuario) {
          return done(null, false);
        }

        if (usuario.estado === 0) {
          return done(null, false, { message: "Usuario inactivo" });
        }

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
