import { Router } from "express";
import { productoController } from "./producto.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { crearProductoSchema, actualizarProductoSchema } from "./producto.schema";

const router = Router();

router.get("/", productoController.listar);
router.get("/:id", productoController.obtener);
router.post("/", validate(crearProductoSchema), productoController.crear);
router.put(
  "/:id",
  validate(actualizarProductoSchema),
  productoController.actualizar,
);
router.delete("/:id", productoController.eliminar);

export default router;
