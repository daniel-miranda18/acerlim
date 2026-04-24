import { Router } from "express";
import { despachoController } from "./despacho.controller";

const router = Router();

router.get("/", despachoController.listar as any);
router.get("/qr/:codigo", despachoController.generarQr as any);
router.get("/buscar/:codigo", despachoController.buscarPorCodigoQr as any);
router.post("/", despachoController.crear as any);

export default router;
