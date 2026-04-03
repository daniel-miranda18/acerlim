import { Router } from "express";
import { loteController } from "./lote.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { crearLoteSchema, actualizarLoteSchema } from "./lote.schema";

const router = Router();

router.get("/", loteController.listar);
router.get("/:id", loteController.obtener);
router.post("/", validate(crearLoteSchema), loteController.crear);
router.put("/:id", validate(actualizarLoteSchema), loteController.actualizar);
router.delete("/:id", loteController.eliminar);

export default router;
