import { Router } from "express";
import { pedidoController } from "./pedido.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { crearPedidoSchema, actualizarPedidoSchema } from "./pedido.schema";

const router = Router();

router.get("/", pedidoController.listar);
router.get("/:id", pedidoController.obtener);
router.post("/", validate(crearPedidoSchema), pedidoController.crear);
router.put("/:id", validate(actualizarPedidoSchema), pedidoController.actualizar);
router.patch("/:id/estado", pedidoController.cambiarEstado);
router.delete("/:id", pedidoController.eliminar);

export default router;
