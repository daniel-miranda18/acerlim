import express from "express";
import path from "path";
import cors from "cors";
import { errorMiddleware } from "./shared/middlewares/error.middleware";
import passport from "./shared/config/passport";
import { requireAuth } from "./shared/middlewares/auth.middleware";
import { requireRole } from "./shared/middlewares/role.middleware";
import authRoutes from "./modules/auth/auth.routes";
import usuarioRoutes from "./modules/usuarios/usuario.routes";
import rolRoutes from "./modules/roles/rol.routes";
import permisoRoutes from "./modules/permisos/permiso.routes";
import rolPermisoRoutes from "./modules/rol_permiso/rol_permiso.routes";
import bobinaRoutes from "./modules/bobinas/bobina.routes";
import productoRoutes from "./modules/productos/producto.routes";
import tipoProductoRoutes from "./modules/productos/tipo-producto.routes";
import dibujoRoutes from "./modules/productos/dibujo.routes";
import proveedorRoutes from "./modules/proveedores/proveedor.routes";
import loteRoutes from "./modules/lotes/lote.routes";
import pedidoRoutes from "./modules/pedidos/pedido.routes";
import precioRoutes from "./modules/precios/precio.routes";
import colorRoutes from "./modules/colores/color.routes";

import produccionRoutes from "./modules/produccion/produccion.routes";
import despachoRoutes from "./modules/despacho/despacho.routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", requireAuth, requireRole(["gerente"]), usuarioRoutes);
app.use("/api/roles", requireAuth, requireRole(["gerente"]), rolRoutes);
app.use("/api/permisos", requireAuth, requireRole(["gerente"]), permisoRoutes);
app.use("/api/roles/:id/permisos", requireAuth, requireRole(["gerente"]), rolPermisoRoutes);
app.use("/api/bobinas", requireAuth, bobinaRoutes);
app.use("/api/productos", requireAuth, productoRoutes);
app.use("/api/tipos-productos", requireAuth, tipoProductoRoutes);
app.use("/api/dibujos-calaminas", requireAuth, dibujoRoutes);
app.use("/api/proveedores", requireAuth, proveedorRoutes);
app.use("/api/lotes", requireAuth, loteRoutes);
app.use("/api/pedidos", requireAuth, pedidoRoutes);
app.use("/api/precios", requireAuth, precioRoutes);
app.use("/api/colores", requireAuth, colorRoutes);
app.use("/api/produccion", requireAuth, produccionRoutes);
app.use("/api/despachos", requireAuth, despachoRoutes);

app.use(errorMiddleware);

export default app;