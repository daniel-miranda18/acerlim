import { Usuario } from "../../generated/prisma";

declare global {
  namespace Express {
    interface User extends Partial<Usuario> {
      id_usuario: number;
    }
    interface Request {
      user?: User;
    }
  }
}
