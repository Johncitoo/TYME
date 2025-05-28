// frontend/src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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

      // 1) Extrae el rol en minúsculas
      let tipo = "";
      if (typeof usuario.tipo_usuario === "string") {
        tipo = usuario.tipo_usuario.toLowerCase();
      } else if (usuario.tipo_usuario?.nombre) {
        tipo = String(usuario.tipo_usuario.nombre).toLowerCase();
      } else if (usuario.rol) {
        tipo = String(usuario.rol).toLowerCase();
      } else if (usuario.role) {
        tipo = String(usuario.role).toLowerCase();
      }

      console.log("ROL DETECTADO:", tipo);

      // 2) Redirige primero a admins, luego a clientes
      if (tipo === "admin") {
        navigate("/admin");
        return;
      } else if (tipo === "cliente") {
        navigate("/home");
        return;
      } else {
        setError("Rol no autorizado");
        return;
      }
    } catch (err) {
      console.error("ERROR FETCH:", err);
      setError("Ocurrió un error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        className="bg-white p-6 rounded shadow w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <h2 className="mb-4 text-xl font-bold">Iniciar sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-sky-500 text-white rounded p-2 font-semibold"
        >
          Ingresar
        </button>
        {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
      </form>
    </div>
  );
}

