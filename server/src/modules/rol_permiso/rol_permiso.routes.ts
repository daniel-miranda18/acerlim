import { Router } from "express";
import { rolPermisoController } from "./rol_permiso.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { asignarPermisosSchema } from "./rol_permiso.schema";

const router = Router({ mergeParams: true });

router.get("/", rolPermisoController.listarPermisos);
router.post(
  "/",
  validate(asignarPermisosSchema),
  rolPermisoController.asignarPermisos,
);
router.put(
  "/",
  validate(asignarPermisosSchema),
  rolPermisoController.sincronizar,
);
router.delete("/:id_permiso", rolPermisoController.quitarPermiso);

export default router;
