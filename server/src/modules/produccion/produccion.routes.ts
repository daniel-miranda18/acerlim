import { Router } from "express";
import { produccionController } from "./produccion.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { crearProduccionSchema } from "./produccion.schema";
import { requireAuth } from "../../shared/middlewares/auth.middleware";

const router = Router();

router.get("/pedido/:id_pedido", requireAuth, produccionController.obtenerPorPedido);
router.post("/", requireAuth, validate(crearProduccionSchema), produccionController.crear);

export default router;
