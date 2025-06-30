import { useEffect, useState } from "react";
import MobileMenu from "../components/MobileMenu";
import { getClasesDisponibles, inscribirAsistencia, getAsistenciasCliente } from "@/services/class.service";
import { Button } from "@/components/ui/button";
import { Loader, CalendarCheck, User } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "sonner";

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
  }, []);

  const fetchClases = async () => {
    setLoading(true);
    const data = await getClasesDisponibles();
    setClases(data);
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

  // Ordenar clases por fecha ascendente, filtrar las pasadas
  const clasesFuturas = clases
    .filter((c) => dayjs(c.fecha_clase + " " + c.hora_inicio).isAfter(dayjs().subtract(1, "day")))
    .sort((a, b) =>
      dayjs(a.fecha_clase + " " + a.hora_inicio).unix() - dayjs(b.fecha_clase + " " + b.hora_inicio).unix()
    );

  const handleInscribir = async (id_clase: number) => {
    try {
      await inscribirAsistencia({ id_clase });
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
    <div className="min-h-screen w-screen bg-zinc-950 flex flex-col overflow-x-hidden">
      <MobileMenu />
      <main className="flex-1 flex flex-col w-full max-w-md mx-auto px-2 pt-3 pb-24">
        <h1 className="text-xl font-bold text-cyan-400 text-center mb-3">
          Clases disponibles
        </h1>
        <section className="flex flex-col gap-4 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center mt-12">
              <Loader className="animate-spin w-8 h-8 text-cyan-400" />
            </div>
          ) : clasesFuturas.length === 0 ? (
            <div className="text-zinc-400 text-center mt-6">
              No hay clases disponibles.
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {clasesFuturas.map((clase) => (
                <li
                  key={clase.id_clase}
                  className="bg-zinc-900 rounded-2xl px-4 py-3 shadow-md flex flex-col gap-2 border border-cyan-900"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarCheck className="w-5 h-5 text-cyan-400" />
                    <span className="font-semibold text-cyan-200 text-lg">
                      {dayjs(clase.fecha_clase).format("ddd DD/MM")}
                    </span>
                    <span className="ml-auto text-cyan-300 text-xs font-mono">
                      {clase.hora_inicio} - {clase.hora_fin}
                    </span>
                  </div>
                  <div className="font-bold text-cyan-300 text-base">{clase.nombre}</div>
                  <div className="text-zinc-300 text-sm">{clase.descripcion}</div>
                  <div className="flex items-center gap-2 text-xs text-cyan-400">
                    <User className="w-4 h-4" />{" "}
                    {clase.entrenador?.usuario?.primer_nombre ?? "Entrenador"}
                    <span className="ml-auto">Cupos: {clase.cupo_maximo}</span>
                  </div>
                  <div className="flex justify-end mt-2">
                    {estaInscrito(clase.id_clase) ? (
                      <span className="text-green-400 font-semibold text-sm">Ya inscrito</span>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 rounded-md"
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
        </section>
      </main>
    </div>
  );
}
