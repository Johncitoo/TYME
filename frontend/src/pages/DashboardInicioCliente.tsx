import { useEffect, useState } from "react";
import MobileMenu from "../components/MobileMenu";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { CalendarCheck, Dumbbell } from "lucide-react";
import DashboardCard from "../components/DashboardCard";

const API_URL = "http://localhost:3000"; // Cambia según tu backend

export default function DashboardInicioCliente() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [rutina, setRutina] = useState(null);
  const [clases, setClases] = useState([]);
  const [error, setError] = useState<string | null>(null);

  // Token JWT del usuario logeado
  const token = localStorage.getItem("token");

  function getClienteIdFromToken(token: string | null) {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || payload.id || payload.rut_cliente || null;
    } catch {
      return null;
    }
  }

  const clienteId = getClienteIdFromToken(token);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError(null);
      try {
        // 1. Perfil
        const usuarioRes = await axios.get(`${API_URL}/cliente/${clienteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(usuarioRes.data);

        // 2. Rutina actual
        const rutinaRes = await axios.get(
          `${API_URL}/rutina/cliente/${clienteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const rutinaData = Array.isArray(rutinaRes.data) ? rutinaRes.data[0] : rutinaRes.data;
        setRutina(rutinaData || null);

        // 3. Próximas clases (ajusta la ruta si tu backend es distinto)
        const clasesRes = await axios.get(
          `${API_URL}/clase/cliente/${clienteId}/semana`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClases(clasesRes.data || []);
      } catch (err: any) {
        setError("No se pudo cargar el dashboard. Intenta nuevamente.");
        setUsuario(null);
        setRutina(null);
        setClases([]);
      } finally {
        setLoading(false);
      }
    }

    if (token && clienteId) fetchDashboard();
  }, [token, clienteId]);

  return (
    <div className="min-h-screen w-screen bg-zinc-950 flex flex-col overflow-x-hidden">
      <MobileMenu />
      <main className="flex-1 w-full flex flex-col items-center justify-start px-4 py-6 gap-4 max-w-md mx-auto">
        {/* Saludo */}
        <section className="w-full text-center mt-2 mb-2">
          <h1 className="text-2xl font-bold text-cyan-400 mb-2">
            {usuario
              ? `¡Hola, ${usuario.nombre || usuario.nombre_completo || usuario.rut_cliente}!`
              : "¡Bienvenido!"}
          </h1>
        </section>

        {/* Próxima clase */}
        <DashboardCard icon={<CalendarCheck className="w-5 h-5" />} title="Próxima clase">
          {loading ? (
            <>Cargando clase...</>
          ) : clases && clases.length > 0 ? (
            <>
              <span className="font-semibold text-zinc-100">{clases[0].nombre}</span>
              <span className="ml-2 text-cyan-300">
                {new Date(clases[0].fecha).toLocaleString("es-CL", {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
            </>
          ) : (
            <>No hay clases próximas.</>
          )}
        </DashboardCard>

        {/* Rutina de hoy */}
        <DashboardCard icon={<Dumbbell className="w-5 h-5" />} title="Rutina de hoy">
          {loading ? (
            <>Cargando rutina...</>
          ) : rutina ? (
            <>
              <span className="font-semibold text-zinc-100">{rutina.nombre}</span>
              {rutina.descripcion && (
                <span className="block text-xs text-zinc-400">{rutina.descripcion}</span>
              )}
            </>
          ) : (
            <>No tienes rutina activa.</>
          )}
        </DashboardCard>

        {error && (
          <div className="w-full text-center text-red-400 font-semibold">
            {error}
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
}
