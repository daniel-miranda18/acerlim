import api from "./api";
import type { ApiResponse } from "../types/api.types";

export interface DibujoCalamina {
  id_dibujo: number;
  id_producto: number;
  largo: number;
  ancho: number;
  area_plana: number | null;
  area_proyectada: number | null;
  configuracion_calculo: any;
  datos_json: string | null;
  imagen_generada: string | null;
  estado: number;
}

export interface CrearDibujoDTO {
  id_producto: number;
  largo: number;
  ancho: number;
  area_plana?: number;
  area_proyectada?: number;
  configuracion_calculo?: any;
  datos_json?: string;
  imagen_generada?: string;
}

export const dibujoService = {
  listarPorProducto: (idProducto: number) =>
    api.get<ApiResponse<DibujoCalamina[]>>(`/dibujos-calaminas/producto/${idProducto}`),
  obtener: (id: number) =>
    api.get<ApiResponse<DibujoCalamina>>(`/dibujos-calaminas/${id}`),
  crear: (data: FormData | CrearDibujoDTO) => {
    const isFormData = data instanceof FormData;
    return api.post<ApiResponse<DibujoCalamina>>("/dibujos-calaminas", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
    });
  },
  actualizar: (id: number, data: Partial<CrearDibujoDTO>) =>
    api.put<ApiResponse<DibujoCalamina>>(`/dibujos-calaminas/${id}`, data),
  eliminar: (id: number) =>
    api.delete<ApiResponse<null>>(`/dibujos-calaminas/${id}`),
};
