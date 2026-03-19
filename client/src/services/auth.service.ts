import api from "./api";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user?: any;
    token?: string;
    requires2FA?: boolean;
    id_usuario?: number;
    correo?: string;
  };
}

export const authService = {
  login: async (correo: string, clave: string): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/login", { correo, clave });
    return res.data;
  },

  verify2FA: async (id_usuario: number, codigo: string): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/verify-2fa", { id_usuario, codigo });
    return res.data;
  },

  resend2FA: async (id_usuario: number) => {
    const res = await api.post("/auth/resend-2fa", { id_usuario });
    return res.data;
  },

  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};
