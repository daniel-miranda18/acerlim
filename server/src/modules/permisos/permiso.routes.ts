import { Router } from "express";
import { permisoController } from "./permiso.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { crearPermisoSchema, actualizarPermisoSchema } from "./permiso.schema";

const router = Router();

router.get("/", permisoController.listar);
router.get("/:id", permisoController.obtener);
router.post("/", validate(crearPermisoSchema), permisoController.crear);
router.put(
  "/:id",
  validate(actualizarPermisoSchema),
  permisoController.actualizar,
);
router.delete("/:id", permisoController.eliminar);

export default router;
