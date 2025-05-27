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
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();
      console.log("STATUS:", response.status);
      console.log("RESPUESTA:", text);

      if (!response.ok) {
        setError("Credenciales incorrectas");
        return;
      }

      const usuario = JSON.parse(text);
      login(usuario);

      // Ajuste flexible para cualquier formato de tipo_usuario
      let tipo = "";
      if (usuario.tipo_usuario) {
        if (typeof usuario.tipo_usuario === "string") {
          tipo = usuario.tipo_usuario;
        } else if (typeof usuario.tipo_usuario === "object" && usuario.tipo_usuario.nombre) {
          tipo = usuario.tipo_usuario.nombre;
        }
      } else if (usuario.rol) {
        tipo = usuario.rol;
      } else if (usuario.role) {
        tipo = usuario.role;
      }

      if (tipo.toLowerCase() === "cliente") {
        navigate("/home");
      } else {
        setError("Solo clientes pueden ingresar aquí por ahora.");
      }
    } catch (err) {
      console.error("ERROR FETCH:", err);
      setError("Ocurrió un error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-6 rounded shadow w-full max-w-sm" onSubmit={handleLogin}>
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
