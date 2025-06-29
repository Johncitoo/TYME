import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import MobileMenu from "../components/MobileMenu";
import type { Rutina, Ejercicio } from "@/types/rutina";

const API_URL = "http://localhost:3000"; // Cambia si es necesario

export default function DashboardRutinaCliente() {
  const [loading, setLoading] = useState(true);
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [dias, setDias] = useState<number[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [idClienteReal, setIdClienteReal] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  // Decodifica el id_usuario desde el JWT (no id_cliente)
  function getUserIdFromToken(token: string | null) {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id_usuario || payload.sub || payload.id || null;
    } catch {
      return null;
    }
  }
  const id_usuario = getUserIdFromToken(token);

  // Paso 1: obtener el id_cliente real a partir del id_usuario
  useEffect(() => {
    async function fetchClienteId() {
      if (!token || !id_usuario) return;
      try {
        const resp = await axios.get(
          `${API_URL}/cliente/usuario/${id_usuario}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIdClienteReal(resp.data.id_cliente);
      } catch {
        setError("No se pudo obtener el cliente.");
      }
    }
    fetchClienteId();
  }, [token, id_usuario]);

  // Paso 2: una vez que tengo id_cliente real, busco la rutina
  useEffect(() => {
    async function fetchRutina() {
      if (!token || !idClienteReal) return;
      setLoading(true);
      setError(null);
      try {
        // 1. Obtener la rutina activa del cliente
        const respRutinas = await axios.get(
          `${API_URL}/cliente_rutina/cliente/${idClienteReal}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const rutinasActivas = Array.isArray(respRutinas.data)
          ? respRutinas.data.filter((r: any) => r.estado === "Activa")
          : [];
        if (!rutinasActivas.length) {
          setRutina(null);
          setEjercicios([]);
          setDias([]);
          return;
        }
        const rutinaActiva = rutinasActivas[0];
        setRutina(rutinaActiva);

        // 2. Obtener ejercicios de la rutina activa
        const respEjercicios = await axios.get(
          `${API_URL}/rutina_ejercicio/rutina/${rutinaActiva.id_rutina}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const ejerciciosAll = Array.isArray(respEjercicios.data)
          ? (respEjercicios.data as Ejercicio[])
          : [];
        setEjercicios(ejerciciosAll);

        // 3. Calcular días disponibles
        const diasUnicos = [
          ...new Set(ejerciciosAll.map((ej) => ej.dia)),
        ].sort((a, b) => a - b);
        setDias(diasUnicos);

        setDiaSeleccionado(diasUnicos[0] || 1);
      } catch (err) {
        setError("No se pudo cargar la rutina. Intenta nuevamente.");
        setRutina(null);
        setEjercicios([]);
        setDias([]);
      } finally {
        setLoading(false);
      }
    }

    if (token && idClienteReal) fetchRutina();
  }, [token, idClienteReal]);

  const ejerciciosDelDia = ejercicios
    .filter((ej) => ej.dia === diaSeleccionado)
    .sort((a, b) => a.orden - b.orden);

  return (
    <div className="min-h-screen w-screen bg-zinc-950 flex flex-col overflow-x-hidden">
      <MobileMenu />
      <main className="flex-1 w-full flex flex-col items-center px-4 py-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-cyan-400 mb-4">Mi Rutina</h1>

        {loading ? (
          <div className="w-full text-center text-zinc-400 py-8">Cargando rutina...</div>
        ) : !rutina ? (
          <div className="w-full text-center text-zinc-400 py-8">
            No tienes una rutina activa actualmente.
          </div>
        ) : (
          <>
            {/* Info de la rutina */}
            <section className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
              <div className="font-bold text-lg text-zinc-100">
                {rutina.rutina?.nombre || rutina.nombre}
              </div>
              {(rutina.rutina?.descripcion || rutina.descripcion) && (
                <div className="text-zinc-400 text-sm mb-2">
                  {rutina.rutina?.descripcion || rutina.descripcion}
                </div>
              )}
              {(rutina.rutina?.fecha_inicio || rutina.fecha_inicio) && (
                <div className="text-xs text-zinc-500">
                  Inicio: {new Date(rutina.rutina?.fecha_inicio || rutina.fecha_inicio || "").toLocaleDateString()}
                </div>
              )}
            </section>

            {/* Selector de día */}
            {dias.length > 1 && (
              <div className="w-full flex items-center justify-center gap-2 mb-4">
                <label className="text-zinc-300 text-sm font-medium mr-2">Día:</label>
                <select
                  value={diaSeleccionado}
                  onChange={(e) => setDiaSeleccionado(Number(e.target.value))}
                  className="bg-zinc-900 border border-cyan-800 text-cyan-200 rounded-xl px-4 py-2 text-base shadow focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {dias.map((dia) => (
                    <option key={dia} value={dia}>
                      Día {dia}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-5 h-5 text-cyan-400 -ml-8 pointer-events-none" />
              </div>
            )}

            {/* Lista de ejercicios del día */}
            <section className="w-full flex flex-col gap-4">
              {ejerciciosDelDia.length === 0 ? (
                <div className="w-full text-center text-zinc-400 py-6">
                  No hay ejercicios para este día.
                </div>
              ) : (
                ejerciciosDelDia.map((ej, idx) => (
                  <div
                    key={ej.id_rutina_ejercicio}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1 shadow-sm"
                  >
                    <div className="font-semibold text-cyan-200 flex items-center gap-2">
                      <span className="text-base">{idx + 1}.</span>
                      <span>{ej.ejercicio?.nombre || ej.nombre}</span>
                    </div>
                    <div className="text-sm text-zinc-300">
                      Series: <span className="font-bold">{ej.series}</span>
                      {ej.peso ? <> | Peso: <span className="font-bold">{ej.peso} kg</span></> : null}
                      {ej.descanso ? <> | Descanso: <span className="font-bold">{ej.descanso}s</span></> : null}
                    </div>
                    {ej.observacion && (
                      <div className="text-xs text-zinc-400">
                        {ej.observacion}
                      </div>
                    )}
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {error && (
          <div className="w-full text-center text-red-400 font-semibold mt-4">{error}</div>
        )}
      </main>
    </div>
  );
}
