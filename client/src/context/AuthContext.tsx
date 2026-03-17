import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import toast from "react-hot-toast";

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  login: (correo: string, clave: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

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
      if (res.success) {
        const { user, token } = res.data;
        localStorage.setItem("token", token);
        setToken(token);
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

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
