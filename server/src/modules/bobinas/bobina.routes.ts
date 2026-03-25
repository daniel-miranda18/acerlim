import { Router } from "express";
import { bobinaController } from "./bobina.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { crearBobinaSchema, actualizarBobinaSchema } from "./bobina.schema";

const router = Router();

router.get("/stock", bobinaController.getStockPorTipo);
router.get("/", bobinaController.listar);
router.get("/:id", bobinaController.obtener);
router.post("/", validate(crearBobinaSchema), bobinaController.crear);
router.put(
  "/:id",
  validate(actualizarBobinaSchema),
  bobinaController.actualizar,
);
router.delete("/:id", bobinaController.eliminar);

export default router;
