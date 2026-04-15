import { Router } from "express";
import { precioController } from "./precio.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { crearPrecioSchema, actualizarPrecioSchema } from "./precio.schema";

const router = Router();

router.get("/", precioController.listar);
router.get("/:id", precioController.obtener);
router.post("/", validate(crearPrecioSchema), precioController.crear);
router.put("/:id", validate(actualizarPrecioSchema), precioController.actualizar);
router.delete("/:id", precioController.eliminar);

export default router;
