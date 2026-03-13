import express from "express";
import cors from "cors";
import { errorMiddleware } from "./shared/middlewares/error.middleware";
import usuarioRoutes from "./modules/usuarios/usuario.routes";
import rolRoutes from "./modules/roles/rol.routes";
import permisoRoutes from "./modules/permisos/permiso.routes";
import rolPermisoRoutes from "./modules/rol_permiso/rol_permiso.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/permisos", permisoRoutes);
app.use("/api/roles/:id/permisos", rolPermisoRoutes);

app.use(errorMiddleware);

export default app;
