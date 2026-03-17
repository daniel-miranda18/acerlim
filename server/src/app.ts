import express from "express";
import cors from "cors";
import { errorMiddleware } from "./shared/middlewares/error.middleware";
import passport from "./shared/config/passport";
import { requireAuth } from "./shared/middlewares/auth.middleware";
import authRoutes from "./modules/auth/auth.routes";
import usuarioRoutes from "./modules/usuarios/usuario.routes";
import rolRoutes from "./modules/roles/rol.routes";
import permisoRoutes from "./modules/permisos/permiso.routes";
import rolPermisoRoutes from "./modules/rol_permiso/rol_permiso.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", requireAuth, usuarioRoutes);
app.use("/api/roles", requireAuth, rolRoutes);
app.use("/api/permisos", requireAuth, permisoRoutes);
app.use("/api/roles/:id/permisos", requireAuth, rolPermisoRoutes);

app.use(errorMiddleware);

export default app;
