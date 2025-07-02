import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LogoTyme from "../assets/Artboard30.png";
import FondoGym from "../assets/DSC01698.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const cleanAllStores = () => {
    useAuthStore.getState().logout();
    useUserStore.getState().logout?.();
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("user-storage");
    localStorage.removeItem("token");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    cleanAllStores();
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setError("Credenciales incorrectas");
        return;
      }
      const usuario = await res.json();
      login(usuario);
      setUser?.(usuario);
      if (usuario.token) {
        localStorage.setItem("token", usuario.token);
      } else if (usuario.access_token) {
        localStorage.setItem("token", usuario.access_token);
      }
      let tipo = "";
      if (typeof usuario.tipo_usuario === "string") tipo = usuario.tipo_usuario.toLowerCase();
      else if (usuario.tipo_usuario?.nombre) tipo = String(usuario.tipo_usuario.nombre).toLowerCase();
      else if (usuario.rol) tipo = String(usuario.rol).toLowerCase();
      else if (usuario.role) tipo = String(usuario.role).toLowerCase();

      if (tipo === "admin") window.location.href = "/admin";
      else if (tipo === "cliente") window.location.href = "/home";
      else if (tipo === "entrenador") window.location.href = "/trainer";
      else setError("Rol no autorizado");
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-2 py-8">
      <img
        src={FondoGym}
        alt="Fondo gym"
        className="absolute inset-0 w-full h-full object-cover brightness-75 blur-sm scale-105 z-0"
        draggable={false}
        style={{ objectPosition: "0% 35%" }} // <--- Cambiado aquí!
      />
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/90 via-cyan-950/60 to-zinc-900/95 z-0" />

      <Card className="relative z-10 w-full max-w-md mx-auto rounded-2xl shadow-2xl border-0 bg-zinc-900/90 backdrop-blur-md">
        <CardHeader className="flex flex-col items-center pb-0">
          <img
            src={LogoTyme}
            alt="TYME Logo"
            className="h-28 sm:h-32 md:h-36 w-auto mb-3 drop-shadow-lg"
            draggable={false}
            style={{ userSelect: "none" }}
          />
          <h2 className="text-2xl font-bold text-cyan-400">Iniciar sesión</h2>
        </CardHeader>
        <CardContent className="pt-2">
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              className="bg-zinc-950/60 text-white placeholder:text-cyan-300"
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-zinc-950/60 text-white placeholder:text-cyan-300"
              required
            />
            <Button
              type="submit"
              className="bg-cyan-400 hover:bg-cyan-500 text-white font-semibold py-2 mt-1 rounded-xl text-lg transition"
              size="lg"
            >
              Ingresar
            </Button>
            {error && (
              <div className="text-red-400 text-center mt-1 text-sm font-medium">{error}</div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
