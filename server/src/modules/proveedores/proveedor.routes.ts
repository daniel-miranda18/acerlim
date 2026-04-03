import { Router } from "express";
import { proveedorController } from "./proveedor.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { crearProveedorSchema, actualizarProveedorSchema } from "./proveedor.schema";

const router = Router();

router.get("/", proveedorController.listar);
router.get("/:id", proveedorController.obtener);
router.post("/", validate(crearProveedorSchema), proveedorController.crear);
router.put("/:id", validate(actualizarProveedorSchema), proveedorController.actualizar);
router.delete("/:id", proveedorController.eliminar);

export default router;
