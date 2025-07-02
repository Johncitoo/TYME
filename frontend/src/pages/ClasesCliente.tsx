import React, { useEffect, useState } from "react";
import { getClasesDisponibles, inscribirAsistencia, getAsistenciasCliente } from "@/services/class.service";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "sonner";
import MobileMenu from "@/components/MobileMenu";

type Clase = {
  id_clase: number;
  fecha_clase: string;
  nombre: string;
  descripcion?: string;
  hora_inicio: string;
  hora_fin: string;
  cupo_maximo: number;
  entrenador: { usuario: { primer_nombre: string } };
};

type Asistencia = {
  id_asistencia: number;
  clase: { id_clase: number };
};

export default function ClasesCliente() {
  const [clases, setClases] = useState<Clase[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClases();
    fetchAsistencias();
    // eslint-disable-next-line
  }, []);

  const fetchClases = async () => {
    setLoading(true);
    try {
      const data = await getClasesDisponibles();
      setClases(data);
    } catch (err) {
      toast.error("Error al cargar clases");
      setClases([]);
    }
    setLoading(false);
  };

  const fetchAsistencias = async () => {
    try {
      const data = await getAsistenciasCliente();
      setAsistencias(data);
    } catch {
      setAsistencias([]);
    }
  };

  // Solo clases futuras (no muestra las anteriores)
  const hoy = dayjs().startOf("day");
  const clasesFuturas = clases
    .filter((c) => dayjs(c.fecha_clase).isAfter(hoy.subtract(1, "day")))
    .sort((a, b) => dayjs(a.fecha_clase).unix() - dayjs(b.fecha_clase).unix());

  const handleInscribir = async (id_clase: number) => {
    try {
      await inscribirAsistencia(id_clase.toString());
      toast.success("¡Inscrito correctamente!");
      fetchAsistencias();
      fetchClases();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al inscribirse");
    }
  };

  const estaInscrito = (id_clase: number) =>
    asistencias.some((a) => a.clase.id_clase === id_clase);

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col pb-6">
      <MobileMenu />
      <h1 className="text-2xl font-bold text-cyan-400 text-center mt-6 mb-2">
        Clases Disponibles
      </h1>

      <div className="flex flex-col px-2 w-full max-w-md mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="animate-spin w-10 h-10 text-cyan-400" />
          </div>
        ) : clasesFuturas.length === 0 ? (
          <div className="text-zinc-400 text-center mt-10 text-base">No hay clases próximas.</div>
        ) : (
          <ul className="flex flex-col gap-3">
            {clasesFuturas.map((clase) => (
              <li
                key={clase.id_clase}
                className="rounded-2xl shadow-lg bg-zinc-900 p-4 flex flex-col gap-2 border border-zinc-800"
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-cyan-400 font-bold flex items-center text-base">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="3" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    {dayjs(clase.fecha_clase).format("ddd D MMM YYYY")}
                  </span>
                  <span className="ml-auto px-2 py-1 rounded bg-cyan-950 text-cyan-400 text-xs font-semibold">
                    {clase.hora_inicio} - {clase.hora_fin}
                  </span>
                </div>
                <div className="font-semibold text-lg text-white">{clase.nombre}</div>
                {clase.descripcion && (
                  <div className="text-zinc-300 text-sm mb-1">{clase.descripcion}</div>
                )}
                <div className="flex items-center gap-1 text-zinc-400 text-xs mb-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="4" />
                    <path d="M5.5 21c0-3.6 3.6-6 8-6s8 2.4 8 6" />
                  </svg>
                  {clase.entrenador?.usuario?.primer_nombre ?? "Entrenador"} • Cupos: {clase.cupo_maximo}
                </div>
                <div className="flex justify-end">
                  {estaInscrito(clase.id_clase) ? (
                    <span className="text-green-400 font-semibold text-sm">Ya inscrito</span>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-cyan-400 text-white font-semibold rounded-lg px-4 py-2 active:bg-cyan-500"
                      onClick={() => handleInscribir(clase.id_clase)}
                    >
                      Inscribirse
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
