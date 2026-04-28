import api from "./api";

export const auditoriaService = {
  getAuditoria: async () => {
    const { data } = await api.get("/auditoria/general");
    return data;
  },
  getEventosHttp: async () => {
    const { data } = await api.get("/auditoria/eventos-http");
    return data;
  },
  getSesiones: async () => {
    const { data } = await api.get("/auditoria/sesiones");
    return data;
  },
};
