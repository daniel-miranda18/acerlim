import { Usuario } from "../../generated/prisma";

declare global {
  namespace Express {
    interface User extends Partial<Usuario> {
      id_usuario: number;
      rol?: { nombre: string };
    }
    interface Request {
      user?: User;
    }
  }
}
