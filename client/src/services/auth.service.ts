import api from "./api";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    token: string;
  };
}

export const authService = {
  login: async (correo: string, clave: string): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/login", { correo, clave });
    return res.data;
  },

  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};
