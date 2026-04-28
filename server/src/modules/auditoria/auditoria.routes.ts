import { Router } from "express";
import { getAuditoria } from "./auditoria.controller";
import { getEventosHttp } from "./eventos-http.controller";
import { getSesiones } from "./sesiones.controller";

const router = Router();

router.get("/general", getAuditoria);
router.get("/eventos-http", getEventosHttp);
router.get("/sesiones", getSesiones);

export default router;
