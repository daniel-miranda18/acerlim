import { Router } from "express";
import { rolController } from "./rol.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { crearRolSchema, actualizarRolSchema } from "./rol.schema";

const router = Router();

router.get("/", rolController.listar);
router.get("/:id", rolController.obtener);
router.post("/", validate(crearRolSchema), rolController.crear);
router.put("/:id", validate(actualizarRolSchema), rolController.actualizar);
router.delete("/:id", rolController.eliminar);

export default router;
