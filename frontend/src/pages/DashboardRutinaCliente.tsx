// src/pages/DashboardRutinaCliente.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, ChevronDown } from "lucide-react";
import MobileMenu from "../components/MobileMenu";

const API_URL = "http://localhost:3000"; // Cambia si es necesario

interface Ejercicio {
  id_rutina_ejercicio: number;
  dia: number;
  orden: number;
  series: number;
  peso?: string | number | null;
  descanso?: number | null;
  observacion?: string | null;
  ejercicio?: {
    nombre: string;
    descripcion?: string;
  };
}

interface Rutina {
  id_rutina: number;
  nombre: string;
  descripcion?: string;
  fecha_inicio: string;
  rutinaEjercicios: Ejercicio[];
}

export default function DashboardRutinaCliente() {
  const [loading, setLoading] = useState(true);
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [dias, setDias] = useState<number[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRutina() {
      setLoading(true);
      setError(null);
      setRutina(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No autenticado");
        const resp = await axios.get(`${API_URL}/rutinas/mi-rutina`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rutinaData: Rutina = resp.data;
        setRutina(rutinaData);

        // Extrae días únicos y ordena
        const diasUnicos = [
          ...new Set(rutinaData.rutinaEjercicios.map((ej) => ej.dia)),
        ].sort((a, b) => a - b) as number[];
        setDias(diasUnicos);
        setDiaSeleccionado(diasUnicos[0] || 1);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "No se pudo cargar la rutina. Intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchRutina();
  }, []);

  // Ejercicios del día seleccionado
  const ejerciciosDelDia =
    rutina?.rutinaEjercicios
      .filter((ej) => ej.dia === diaSeleccionado)
      .sort((a, b) => a.orden - b.orden) ?? [];

  return (
    <div className="min-h-screen w-screen bg-zinc-950 flex flex-col overflow-x-hidden">
      <MobileMenu />
      <main className="flex-1 w-full flex flex-col items-center px-4 py-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">Mi Rutina</h1>

        {dias.length > 0 && (
          <div className="w-full flex items-center justify-center gap-2 mb-4">
            <label className="text-cyan-400 text-lg font-semibold mr-2">
              Día:
            </label>
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

        {loading ? (
          <div className="w-full text-center text-zinc-400 py-8">
            Cargando rutina...
          </div>
        ) : error ? (
          <div className="w-full text-center text-red-400 py-8">
            {error}
          </div>
        ) : !rutina ? (
          <div className="w-full text-center text-zinc-400 py-8">
            No tienes una rutina activa actualmente.
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 w-full">
              {ejerciciosDelDia.length === 0 ? (
                <div className="w-full text-center text-zinc-400 py-6">
                  No hay ejercicios para este día.
                </div>
              ) : (
                ejerciciosDelDia.map((ej) => (
                  <div
                    key={ej.id_rutina_ejercicio}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg mb-2"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm text-cyan-300 font-bold">
                        {`Ejercicio ${ej.orden}`}
                      </span>
                    </div>
                    <div className="font-bold text-lg text-zinc-100 mb-1">
                      {ej.ejercicio?.nombre}
                    </div>
                    <div className="text-zinc-400 text-sm mb-1">
                      Series:{" "}
                      <span className="font-bold">{ej.series}</span>
                      {ej.peso !== null && ej.peso !== undefined && (
                        <>
                          {" "}
                          | Peso:{" "}
                          <span className="font-bold">{ej.peso} kg</span>
                        </>
                      )}
                      {ej.descanso !== null && ej.descanso !== undefined && (
                        <>
                          {" "}
                          | Descanso:{" "}
                          <span className="font-bold">{ej.descanso}s</span>
                        </>
                      )}
                    </div>
                    {ej.observacion && (
                      <div className="text-xs text-zinc-400 mt-1">
                        {ej.observacion}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
