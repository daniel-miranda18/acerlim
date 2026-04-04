import { Router } from "express";
import { TipoProductoController } from "./tipo-producto.controller";
import { requireAuth } from "../../shared/middlewares/auth.middleware";

const router = Router();
const controller = new TipoProductoController();

router.get("/", requireAuth, controller.obtenerTodos);

export default router;
