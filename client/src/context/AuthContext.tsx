import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import toast from "react-hot-toast";

interface Pending2FA {
  id_usuario: number;
  correo: string;
}

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  pending2FA: Pending2FA | null;
  login: (correo: string, clave: string) => Promise<void>;
  verify2FA: (codigo: string) => Promise<void>;
  resend2FA: () => Promise<void>;
  cancel2FA: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [pending2FA, setPending2FA] = useState<Pending2FA | null>(null);

  const checkAuth = async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();
      if (res.success) {
        setUser(res.data);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (correo: string, clave: string) => {
    try {
      const res = await authService.login(correo, clave);
      if (res.success && res.data.requires2FA) {
        setPending2FA({
          id_usuario: res.data.id_usuario!,
          correo: res.data.correo!,
        });
        toast.success(res.message || "Código enviado a tu correo");
      } else if (res.success && res.data.token) {
        const { user, token } = res.data;
        localStorage.setItem("token", token!);
        setToken(token!);
        setUser(user);
        toast.success(res.message || "Bienvenido!");
      } else {
        toast.error(res.message || "Error al iniciar sesión");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error de conexión");
      throw error;
    }
  };

  const verify2FA = async (codigo: string) => {
    if (!pending2FA) return;
    try {
      const res = await authService.verify2FA(pending2FA.id_usuario, codigo);
      if (res.success && res.data.token) {
        const { user, token } = res.data;
        localStorage.setItem("token", token!);
        setToken(token!);
        setUser(user);
        setPending2FA(null);
        toast.success(res.message || "Bienvenido!");
      } else {
        toast.error(res.message || "Código inválido");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Código inválido");
      throw error;
    }
  };

  const resend2FA = async () => {
    if (!pending2FA) return;
    try {
      const res = await authService.resend2FA(pending2FA.id_usuario);
      if (res.success) {
        toast.success(res.message || "Nuevo código enviado");
      } else {
        toast.error(res.message || "Error al reenviar");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al reenviar");
    }
  };

  const cancel2FA = () => {
    setPending2FA(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        pending2FA,
        login,
        verify2FA,
        resend2FA,
        cancel2FA,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
