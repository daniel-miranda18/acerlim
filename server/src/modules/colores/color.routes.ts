import { Router } from "express";
import { colorController } from "./color.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { crearColorSchema, actualizarColorSchema } from "./color.schema";

const router = Router();

router.get("/", colorController.listar);
router.get("/:id", colorController.obtener);
router.post("/", validate(crearColorSchema), colorController.crear);
router.put("/:id", validate(actualizarColorSchema), colorController.actualizar);
router.delete("/:id", colorController.eliminar);

export default router;
