import { Router } from "express";
import { usuarioController } from "./usuario.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { crearUsuarioSchema, actualizarUsuarioSchema } from "./usuario.schema";

const router = Router();

router.get("/", usuarioController.listar);
router.get("/:id", usuarioController.obtener);
router.post("/", validate(crearUsuarioSchema), usuarioController.crear);
router.put(
  "/:id",
  validate(actualizarUsuarioSchema),
  usuarioController.actualizar,
);
router.delete("/:id", usuarioController.eliminar);

export default router;
