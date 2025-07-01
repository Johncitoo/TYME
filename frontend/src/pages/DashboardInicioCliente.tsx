import { useEffect, useState } from "react";
import MobileMenu from "../components/MobileMenu";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { CalendarCheck, Dumbbell, User } from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import dayjs from "dayjs";
import "dayjs/locale/es";

const API_URL = "http://localhost:3000"; // Cambia según tu backend

export default function DashboardInicioCliente() {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [rutina, setRutina] = useState<any>(null);
  const [clases, setClases] = useState<any[]>([]);
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

        // 3. Próximas clases INSCRITAS (ajusta la ruta si tu backend es distinto)
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

  // Filtrar solo clases futuras donde no haya terminado (día y hora_fin)
  const ahora = dayjs();
  const clasesProximas = (clases || [])
    .filter((clase) => {
      // Se asume que clase.fecha_clase es YYYY-MM-DD y hora_fin es HH:mm
      const finClase = dayjs(`${clase.fecha_clase} ${clase.hora_fin}`);
      return finClase.isAfter(ahora);
    })
    .sort((a, b) => {
      const aDate = dayjs(`${a.fecha_clase} ${a.hora_inicio}`);
      const bDate = dayjs(`${b.fecha_clase} ${b.hora_inicio}`);
      return aDate.valueOf() - bDate.valueOf();
    });

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

        {/* Próximas clases INSCRITAS */}
        <DashboardCard icon={<CalendarCheck className="w-5 h-5" />} title="Tus próximas clases">
          {loading ? (
            <>Cargando clases...</>
          ) : clasesProximas.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {clasesProximas.slice(0, 3).map((clase) => (
                <li key={clase.id_clase} className="flex flex-col rounded-lg bg-zinc-900 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-100 text-base">{clase.nombre}</span>
                    <span className="text-xs text-cyan-300 font-semibold">
                      {dayjs(`${clase.fecha_clase} ${clase.hora_inicio}`).locale("es").format("ddd D MMM")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-zinc-400">
                      {clase.hora_inicio} - {clase.hora_fin}
                    </span>
                    {clase.entrenador?.usuario?.primer_nombre && (
                      <span className="flex items-center gap-1 text-xs text-zinc-400">
                        <User className="w-3 h-3" /> {clase.entrenador.usuario.primer_nombre}
                      </span>
                    )}
                  </div>
                  {clase.descripcion && (
                    <span className="block text-xs text-zinc-500 mt-1">{clase.descripcion}</span>
                  )}
                </li>
              ))}
              {clasesProximas.length > 3 && (
                <span className="text-xs text-cyan-500 mt-2 text-right">Y {clasesProximas.length - 3} más...</span>
              )}
            </ul>
          ) : (
            <>No tienes clases próximas.</>
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
