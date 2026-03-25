import { Router } from "express";
import { dibujoController } from "./dibujo.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { dibujoCalaminaSchema } from "./dibujo.schema";

const router = Router();

router.get("/producto/:idProducto", dibujoController.listarPorProducto);
router.get("/:id", dibujoController.obtener);
router.post("/", validate(dibujoCalaminaSchema), dibujoController.crear);
router.put("/:id", validate(dibujoCalaminaSchema.partial()), dibujoController.actualizar);
router.delete("/:id", dibujoController.eliminar);

export default router;
