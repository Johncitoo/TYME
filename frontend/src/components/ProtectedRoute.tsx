import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const usuario = useAuthStore((state) => state.usuario);

  const isAuthenticated = !!usuario;

  // Obtén el tipo_usuario como string
  let tipo = "";
  if (usuario?.tipo_usuario) {
    if (typeof usuario.tipo_usuario === "string") {
      tipo = usuario.tipo_usuario;
    } else if (
      typeof usuario.tipo_usuario === "object" &&
      usuario.tipo_usuario !== null &&
      "nombre" in usuario.tipo_usuario &&
      typeof (usuario.tipo_usuario as { nombre?: string }).nombre === "string"
    ) {
      tipo = (usuario.tipo_usuario as { nombre: string }).nombre;
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Comprueba roles
  if (allowedRoles && !allowedRoles.includes(tipo.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
